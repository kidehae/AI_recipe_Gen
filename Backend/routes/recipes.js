const express = require('express');
const router = express.Router();
const { 
  generateRecipe, 
  saveRecipe, 
  getSavedRecipes, 
  deleteRecipe 
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// Apply JWT verification middleware to all endpoints below
router.use(protect);

router.post('/generate', generateRecipe);
router.post('/save', saveRecipe);
router.get('/', getSavedRecipes);
router.delete('/:id', deleteRecipe);

module.exports = router;