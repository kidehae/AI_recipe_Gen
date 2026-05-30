const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound index as specified in your SRS for instant page loads
RecipeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recipe', RecipeSchema);