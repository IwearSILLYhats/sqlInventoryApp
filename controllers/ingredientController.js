const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const query = require("../db/pool");

const ingredientValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Ingredient name must be alphanumeric")
    .isLength(3).withMessage("Ingredient name must be at least 3 characters"),
    body("type").isIn(["dry", "cold", "produce"])
    .withMessage("Please choose one of the provided types."),
    body("description").trim().escape()
    .optional()
];

// ingredient GET for one ingredient
exports.getIngredient = asyncHandler( async (req, res) => {
    const ingredient = await query({
        text: "SELECT * FROM ingredients WHERE ingredient_id = $1",
        values: [req.params.id]
    });
    if(ingredient.rows[0] === undefined) {
        return res.redirect("/ingredients");
    }
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
exports.createIngredientPost = [
    ingredientValidation,
    asyncHandler( async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render("ingredientForm", {
                title: "Create an Ingredient",
                errors: errors.array(),
                ingredient: {
                    ingredient_name: req.body.name,
                    ingredient_type: req.body.type,
                    ingredient_description: req.body.description
                }
            });
        }
        await query({ text: "INSERT INTO ingredients (ingredient_name, ingredient_type, ingredient_description) VALUES ($1, $2, $3)",
            values: [req.body.name, req.body.type, req.body.description]
        });
        res.redirect("/ingredients");
    })
];

// handle GET for ingredient update form
exports.updateIngredientGet = asyncHandler ( async (req, res) => {
    const ingredient = await query({
        text: "SELECT * FROM ingredients WHERE ingredient_id = $1",
        values: [req.params.id]
    })
    if(ingredient.rows[0] === undefined) {
        return res.redirect("/ingredients");
    }
    res.render("ingredientForm", {
        title: "Update an Ingredient",
        ingredient: ingredient.rows[0]
    });
});

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