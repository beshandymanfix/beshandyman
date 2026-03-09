const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');
const Review = require('./models/Review');
const generateToken = require('./utils/generateToken');
const { protect } = require('./middleware/authMiddleware');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

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
  const { name, email, password, skills } = req.body;

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
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        isAdmin: user.isAdmin,
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
        isAdmin: user.isAdmin,
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
      isAdmin: user.isAdmin,
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

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      city: updatedUser.city,
      skills: updatedUser.skills,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
