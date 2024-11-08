const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const query = require("../db/pool");

const recipeValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Recipe name must be alphanumeric")
    .isLength(3).withMessage("Recipe name must be at least 3 characters"),
    body("tags"),
    body("ingredients"),
    body("description").trim().escape()
    .isAlphanumeric().withMessage("Description must be alphanumeric")
    .optional()
];

// recipe GET for one recipe
exports.getRecipe = asyncHandler( async (req, res) => {
    const recipe = await query({
        text: "SELECT * FROM recipes WHERE recipe_id = $1",
        values: [req.params.id]
    });
    if(recipe.rows[0] === undefined) {
        return res.redirect("/recipes");
    }
    res.render("recipeDetail", {
        title: "Recipe Detail",
        recipe: recipe.rows[0]
    });
});

// handle GET for recipe creation form
exports.createRecipeGet = (req, res) => {

};

// handle POST for recipe creation form
exports.createRecipePost = (req, res) => {

};

// handle GET for recipe update form
exports.updateRecipeGet = (req, res) => {

};

// handle POST for recipe update form
exports.updateRecipePost = (req, res) => {

};

// handle GET for recipe deletion form
exports.deleteRecipeGet = (req, res) => {

};

// handle POST for recipe deletion form
exports.deleteRecipePost = (req, res) => {

};

// GET full list of recipes
exports.recipeList = asyncHandler( async (req, res) => {
    const recipes = await query("SELECT * FROM recipes");
    res.render("recipelist", { title: "Recipe List", recipes: recipes.rows });
});