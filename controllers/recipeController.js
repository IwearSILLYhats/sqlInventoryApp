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

// handle GET for recipe creation form

// handle POST for recipe creation form

// handle GET for recipe update form

// handle POST for recipe update form

// handle GET for recipe deletion form

// handle POST for recipe deletion form

// GET full list of recipes