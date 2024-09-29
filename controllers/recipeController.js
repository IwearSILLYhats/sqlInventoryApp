const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.getRecipe = (req, res) => {

};

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
exports.recipeList = (req, res) => {

};