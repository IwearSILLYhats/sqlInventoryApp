const { Router } = require("express");
const ingredientsRouter = Router();

const ingredientController = require("../controllers/ingredientController");

// GET full list of ingredients
ingredientsRouter.get("/", ingredientController.ingredientList);

// handle GET for ingredient creation form
ingredientsRouter.get("/create", ingredientController.createIngredientGet);

// handle POST for ingredient creation form
ingredientsRouter.post("/create", ingredientController.createIngredientPost);

// handle GET for ingredient update form
ingredientsRouter.get("/update/:id", ingredientController.updateIngredientGet);

// handle POST for ingredient update form
ingredientsRouter.post("/update/:id", ingredientController.updateIngredientPost);

// handle GET for ingredient deletion form
ingredientsRouter.get("/delete/:id", ingredientController.deleteIngredientGet);

// handle POST for ingredient deletion form
ingredientsRouter.post("/delete/:id", ingredientController.deleteIngredientPost);

// ingredient GET for one ingredient
// this route needs to be last
ingredientsRouter.get("/:id", ingredientController.getIngredient);

module.exports = ingredientsRouter;