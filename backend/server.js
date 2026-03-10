const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');
const Review = require('./models/Review');
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
    const users = await User.find(query).select('-password');
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const userObj = user.toObject();
      
      // Fetch all reviews to calculate stats
      const reviews = await Review.find({ handyman: user._id });
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
  const { name, email, password, skills, profileImage, gallery, role, description, skillImages } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      skills: skills || [],
      profileImage: profileImage || '',
      gallery: gallery || [],
      role: role || 'client',
      description: description || '',
      skillImages: skillImages || {},
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
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
        description: user.description,
        skillImages: user.skillImages,
        token: generateToken(user._id),
      });
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
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
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
        description: user.description,
        skillImages: user.skillImages,
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
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
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
      description: user.description,
      skillImages: user.skillImages,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/api/users/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
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
    if (req.body.description !== undefined) {
      user.description = req.body.description;
    }
    if (req.body.skillImages) {
      user.skillImages = req.body.skillImages;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
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
      description: updatedUser.description,
      skillImages: updatedUser.skillImages,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      const userObj = user.toObject();
      
      // Fetch reviews for this user
      const reviews = await Review.find({ handyman: user._id }).sort({ createdAt: -1 });
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
