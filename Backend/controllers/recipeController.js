const Recipe = require('../models/Recipe');
const { generateRecipeFromAI } = require('../services/groqAI');


const generateRecipe = async (req, res) => {
  const { ingredients } = req.body;

  try {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of ingredients.' });
    }

    // Call our Groq wrapper service
    const aiRecipe = await generateRecipeFromAI(ingredients);

    // Return the generated recipe structure cleanly to the client
    res.status(200).json(aiRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const saveRecipe = async (req, res) => {
  const { title, ingredients, instructions, cookingTime, difficulty } = req.body;

  try {
    // Validate that all required properties are coming from the frontend
    if (!title || !ingredients || !instructions || !cookingTime || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields to save recipe.' });
    }

    const savedRecipe = await Recipe.create({
      userId: req.user._id, 
      title,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
    });

    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error saving recipe layout.', error: error.message });
  }
};


const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recipes.', error: error.message });
  }
};


const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Security check: Ensure the recipe belongs to the logged-in user
    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this recipe.' });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: 'Recipe removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe.', error: error.message });
  }
};

module.exports = {
  generateRecipe,
  saveRecipe,
  getSavedRecipes,
  deleteRecipe,
};