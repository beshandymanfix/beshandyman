const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { connectDB, Tasker, Guest, Review } = require('./db');
// You can eventually remove the old User import below if you fully migrate to Tasker/Guest
const User = require('./models/User'); 
const generateToken = require('./utils/generateToken');
const { protect } = require('./middleware/authMiddleware');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, MP4, and MOV are allowed!'), false);
    }
  },
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send(req.file.location);
});

// Create a Review (Guests Only)
app.post('/api/reviews', protect, async (req, res) => {
  const { taskerId, rating, comment, service } = req.body;

  try {
    // Ensure the logged-in user is a Guest
    if (req.user.role !== 'guest') {
      return res.status(403).json({ message: 'Only guests can leave reviews' });
    }

    const review = await Review.create({
      tasker: taskerId,
      guest: req.user._id,
      rating,
      comment,
      service
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/users', async (req, res) => {
  const { city, skill } = req.query;
  let query = {};

  if (city) {
    query.city = city;
  }

  if (skill) {
    query.skills = { $in: [skill] };
  }

  try {
    const users = await Tasker.find(query).select('-password');
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();
      
      // Fetch all reviews to calculate stats
      const reviews = await Review.find({ tasker: user._id });
      const totalReviews = reviews.length;
      userObj.totalReviews = totalReviews;
      
      // Calculate Average Rating
      if (totalReviews > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        userObj.averageRating = sum / totalReviews;
      } else {
        userObj.averageRating = 0;
      }
      
      if (skill) {
        const taskCount = reviews.filter(r => r.service === skill).length;
        userObj.taskCount = taskCount;
      } else {
        userObj.taskCount = totalReviews;
      }
      return userObj;
    }));

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, password, skills, profileImage, gallery, role, aboutMe, skillImages, city, state, driverLicense, trainingAcknowledged } = req.body;

  try {
    // Determine collection based on role
    let userExists;
    if (role === 'tasker') {
      userExists = await Tasker.findOne({ email });
    } else {
      userExists = await Guest.findOne({ email });
    }

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let user;
    if (role === 'tasker') {
      user = await Tasker.create({
      fullName: name,
      email,
      password,
      city,
      state,
      driverLicense: driverLicense || [], // Expecting array of URLs [front, back]
      skills: skills || [],
      role: 'tasker',
      aboutMe: aboutMe || '',
      gallery: gallery || [],
      profileImage: profileImage || '',
      trainingAcknowledged: trainingAcknowledged || false,
      isVerified: false, // Default to false until approved
      // hourlyRate: 50 // Removed default so it is optional
      });
    } else {
      user = await Guest.create({
        fullName: name,
        email,
        password,
        role: 'guest'
      });
    }

    if (user) {
      const response = {
        _id: user._id,
        name: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      };

      // If user is a Tasker, send the specific approval message
      if (user.role === 'tasker') {
        response.isVerified = user.isVerified;
        response.message = "Please confirm with your email before next process identify security and check background for all taskers";
      }

      res.status(201).json(response);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check Tasker collection first
    let user = await Tasker.findOne({ email });
    
    // If not found, check Guest collection
    if (!user) {
      user = await Guest.findOne({ email });
    }

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/profile', protect, async (req, res) => {
  // Use the model constructor from the logged-in user (Tasker or Guest)
  const user = await req.user.constructor.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.fullName || user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      skills: user.skills,
      profileImage: user.profileImage,
      gallery: user.gallery,
      role: user.role,
      state: user.state,
      hourlyRate: user.hourlyRate,
      skillRates: user.skillRates,
      driverLicense: user.driverLicense,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      aboutMe: user.aboutMe,
      skillImages: user.skillImages,
      skillDescriptions: user.skillDescriptions,
      skillYears: user.skillYears,
      skillLevels: user.skillLevels,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/users/profile', protect, async (req, res) => {
  // Use the model constructor from the logged-in user (Tasker or Guest)
  const user = await req.user.constructor.findById(req.user._id);

  if (user) {
    if (req.body.name) {
      if (req.body.name !== user.fullName) {
        const taskerExists = await Tasker.findOne({ fullName: req.body.name });
        const guestExists = await Guest.findOne({ fullName: req.body.name });
        if (taskerExists || guestExists) {
          return res.status(400).json({ message: 'Username already taken' });
        }
      }
      user.name = req.body.name;
      user.fullName = req.body.name;
    }
    if (req.body.firstName !== undefined) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName !== undefined) {
      user.lastName = req.body.lastName;
    }
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.city) {
      user.city = req.body.city;
    }
    if (req.body.skills !== undefined) {
      user.skills = req.body.skills;
    }
    if (req.body.address) {
      user.address = req.body.address;
    }
    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }
    if (req.body.gallery !== undefined) {
      user.gallery = req.body.gallery;
    }
    if (req.body.state) {
      user.state = req.body.state;
    }
    if (req.body.hourlyRate) {
      user.hourlyRate = req.body.hourlyRate;
    }
    if (req.body.skillRates) {
      user.skillRates = req.body.skillRates;
    }
    if (req.body.driverLicense) {
      user.driverLicense = req.body.driverLicense;
    }
    if (req.body.isVerified !== undefined) {
      user.isVerified = req.body.isVerified;
    }
    if (req.body.aboutMe !== undefined) {
      user.aboutMe = req.body.aboutMe;
    }
    if (req.body.skillImages) {
      user.skillImages = req.body.skillImages;
    }
    if (req.body.skillDescriptions) {
      user.skillDescriptions = req.body.skillDescriptions;
    }
    if (req.body.skillYears) {
      user.skillYears = req.body.skillYears;
    }
    if (req.body.skillLevels) {
      user.skillLevels = req.body.skillLevels;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.fullName || updatedUser.name,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      city: updatedUser.city,
      skills: updatedUser.skills,
      profileImage: updatedUser.profileImage,
      gallery: updatedUser.gallery,
      role: updatedUser.role,
      state: updatedUser.state,
      hourlyRate: updatedUser.hourlyRate,
      skillRates: updatedUser.skillRates,
      driverLicense: updatedUser.driverLicense,
      isVerified: updatedUser.isVerified,
      isAdmin: updatedUser.isAdmin,
      aboutMe: updatedUser.aboutMe,
      skillImages: updatedUser.skillImages,
      skillDescriptions: updatedUser.skillDescriptions,
      skillYears: updatedUser.skillYears,
      skillLevels: updatedUser.skillLevels,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await Tasker.findById(req.params.id).select('-password');
    if (user) {
      const userObj = user.toObject();
      userObj.name = userObj.fullName || userObj.name;
      
      // Fetch reviews for this user
      const reviews = await Review.find({ tasker: user._id }).sort({ createdAt: -1 });
      userObj.reviews = reviews;
      userObj.totalReviews = reviews.length;
      
      // Calculate task counts per skill
      const skillCounts = {};
      reviews.forEach(review => {
        if (review.service) skillCounts[review.service] = (skillCounts[review.service] || 0) + 1;
      });
      userObj.skillCounts = skillCounts;
      
      if (userObj.totalReviews > 0) {
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        userObj.averageRating = sum / userObj.totalReviews;
      } else {
        userObj.averageRating = 0;
      }

      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
