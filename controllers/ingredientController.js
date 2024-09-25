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

// handle GET for ingredient creation form

// handle POST for ingredient creation form

// handle GET for ingredient update form

// handle POST for ingredient update form

// handle GET for ingredient deletion form

// handle POST for ingredient deletion form

// GET full list of ingredients