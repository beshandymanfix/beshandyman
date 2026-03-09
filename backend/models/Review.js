const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  handyman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 5,
  },
  comment: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);