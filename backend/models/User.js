const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: 'client', // 'client' or 'tasker'
    },
    city: {
    type: String,
    required: false,
    },
    skills: {
      type: [String],
      required: false,
      default: [],
    },
    profileImage: {
      type: String,
      required: false,
      default: '',
    },
    state: {
      type: String,
      required: false,
    },
    hourlyRate: {
      type: Number,
      required: false,
      default: 50,
    },
    skillRates: {
      type: Map,
      of: Number,
      required: false,
      default: {},
    },
    skillImages: {
      type: Map,
      of: String,
      required: false,
      default: {},
    },
    driverLicense: {
      type: String,
      required: false,
      default: '',
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    gallery: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
