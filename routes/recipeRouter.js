const { Router } = require("express");
const recipesRouter = Router();

const recipecontroller = require("../controllers/recipeController");

// GET full list of recipes
recipesRouter.get("/", recipecontroller.recipeList);

// handle GET for recipe creation form
recipesRouter.get("/create", recipecontroller.createRecipeGet);

// handle POST for recipe creation form
recipesRouter.post("/create", recipecontroller.createRecipePost);

// handle GET for recipe update form
recipesRouter.get("/update/:id", recipecontroller.updateRecipeGet);

// handle POST for recipe update form
recipesRouter.post("/update/:id", recipecontroller.updateRecipePost);

// handle GET for recipe deletion form
recipesRouter.get("/delete/:id", recipecontroller.deleteRecipeGet);

// handle POST for recipe deletion form
recipesRouter.post("/delete/:id", recipecontroller.deleteRecipePost);

// recipe GET for one recipe
// this route needs to be last
recipesRouter.get("/:id", recipecontroller.getRecipe);

module.exports = recipesRouter;