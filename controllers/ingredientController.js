const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const ingredientValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Ingredient name must be alphanumeric")
    .isLength(3).withMessage("Ingredient name must be at least 3 characters"),
    body("type"),
    body("description").trim().escape()
    .isAlphanumeric().withMessage("Description must be alphanumeric")
    .optional()
];

// ingredient GET for one ingredient
exports.getIngredient = (req, res) => {

};

// handle GET for ingredient creation form
exports.createIngredientGet = (req, res) => {

};

// handle POST for ingredient creation form
exports.createIngredientPost = (req, res) => {

};

// handle GET for ingredient update form
exports.updateIngredientGet = (req, res) => {

};

// handle POST for ingredient update form
exports.updateIngredientPost = (req, res) => {

};

// handle GET for ingredient deletion form
exports.deleteIngredientGet = (req, res) => {

};

// handle POST for ingredient deletion form
exports.deleteIngredientPost = (req, res) => {

};

// GET full list of ingredients
exports.ingredientList = (req, res) => {

};