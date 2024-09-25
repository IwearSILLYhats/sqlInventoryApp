const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const tagValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Tag name must be alphanumeric")
    .isLength(3).withMessage("Tag name must be at least 3 characters"),
    body("description").trim().escape()
    .isAlphanumeric().withMessage("Description must be alphanumeric")
    .optional()
];

// tag GET for one tag

// handle GET for tag creation form

// handle POST for tag creation form

// handle GET for tag update form

// handle POST for tag update form

// handle GET for tag deletion form

// handle POST for tag deletion form

// GET full list of tags
exports.tagList = asyncHandler(async (req, res) => {
    const tags = await 
});