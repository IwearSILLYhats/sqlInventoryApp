const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const query = require("../db/pool");

const ingredientValidation = [
    body("ingredient").trim().escape()
    .isAlphanumeric().withMessage("Ingredient name must be alphanumeric")
    .isLength(3).withMessage("Ingredient name must be at least 3 characters"),
    body("type"),
    body("description").trim().escape()
    .optional()
];

// ingredient GET for one ingredient
exports.getIngredient = asyncHandler( async (req, res) => {
    const ingredient = await query({
        text: "SELECT * FROM ingredients WHERE ingredient_id = $1",
        values: [req.params.id]
    });
    res.render("ingredientDetail", {
        title: "Ingredient Detail",
        ingredient: ingredient.rows[0]
    });
});

// handle GET for ingredient creation form
exports.createIngredientGet = (req, res) => {
    res.render("ingredientForm", {title: "Create an Ingredient"});
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
exports.ingredientList = asyncHandler( async (req, res) => {
    const ingredients = await query("SELECT * FROM ingredients");
    res.render("ingredientlist", { title: "Ingredient List", ingredients: ingredients.rows });
});