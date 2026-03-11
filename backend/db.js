const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beshandyman');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// 1. Tasker Schema
const taskerSchema = new Schema({
  fullName: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure you hash passwords before saving
  skills: [String], // e.g., ['plumbing', 'electrical']
  hourlyRate: { type: Number },
  skillRates: { type: Map, of: Number },
  skillImages: { type: Map, of: [String] },
  skillDescriptions: { type: Map, of: String },
  skillYears: { type: Map, of: String },
  skillLevels: { type: Map, of: String },
  aboutMe: { type: String },
  gallery: [String],
  profileImage: { type: String },
  trainingAcknowledged: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  // Optional: Cache average rating for easier access
  averageRating: { type: Number, default: 0 },
  city: { type: String },
  state: { type: String },
  driverLicense: [String], // Array to store URLs for front and back images
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'tasker' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Guest Schema
const guestSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  // STORE THIRD PARTY ID HERE (Never store raw card info)
  stripeCustomerId: { type: String }, 
  city: { type: String },
  state: { type: String },
  role: { type: String, default: 'guest' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Review Schema
const reviewSchema = new Schema({
  tasker: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tasker', // References the Tasker model
    required: true 
  },
  guest: { 
    type: Schema.Types.ObjectId, 
    ref: 'Guest', // References the Guest model
    required: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  service: { type: String }, // To track which service was reviewed (e.g. 'plumbing')
  createdAt: { type: Date, default: Date.now }
});

// Using mongoose.models to prevent OverwriteModelError in development/HMR environments
const Tasker = mongoose.models.Tasker || mongoose.model('Tasker', taskerSchema);
const Guest = mongoose.models.Guest || mongoose.model('Guest', guestSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// Only one module.exports at the end of the file
module.exports = { connectDB, Tasker, Guest, Review };
