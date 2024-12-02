const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pool");

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
    const ingredient = await pool.query({
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
        await pool.query({ text: "INSERT INTO ingredients (ingredient_name, ingredient_type, ingredient_description) VALUES ($1, $2, $3)",
            values: [req.body.name, req.body.type, req.body.description]
        });
        res.redirect("/ingredients");
    })
];

// handle GET for ingredient update form
exports.updateIngredientGet = asyncHandler ( async (req, res) => {
    const ingredient = await pool.query({
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
exports.updateIngredientPost = [
    ingredientValidation,
    asyncHandler( async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render("ingredientForm", {
                title: "Update an Ingredient",
                errors: errors.array(),
                ingredient: {
                    ingredient_name: req.body.name,
                    ingredient_type: req.body.type,
                    ingredient_description: req.body.description
                }
            });
        }
        await pool.query({ text: "UPDATE ingredients SET (ingredient_name, ingredient_type, ingredient_description) = ($1, $2, $3) WHERE ingredient_id = $4",
            values: [req.body.name, req.body.type, req.body.description, req.params.id]
        });
        res.redirect("/ingredients");
    })
];

// handle GET for ingredient deletion form
exports.deleteIngredientGet = asyncHandler( async (req, res) => {
    const [ingredient, recipes] = await Promise.all([
        pool.query({
            text: `
                SELECT
                    *
                FROM
                    ingredients
                WHERE
                    ingredient_id = $1`,
            values: [req.params.id]
        }),
        pool.query({
            text: `
                SELECT
                    *
                FROM
                    recipeingredients
                LEFT JOIN
                    recipes
                ON
                    recipeid = recipe_id
                WHERE
                    ingredientid = $1`,
            values: [req.params.id]
        })
    ]);

    if(ingredient !== null) {
        res.render("ingredientDelete", {
            title: "Delete an ingredient",
            ingredient: ingredient.rows[0],
            recipes: recipes.rows
        })
    }
    else{
        res.redirect("/ingredients");
    }
});

// handle POST for ingredient deletion form
exports.deleteIngredientPost = asyncHandler( async (req, res) => {
    const client = await pool.connect();
        try{
            const ingredientid = parseInt(req.body.id);

            await client.query('BEGIN');

            await Promise.all([
                client.query({
                    text: `
                        DELETE FROM
                            recipeingredients
                        WHERE
                            ingredientid = $1`,
                    values: [ingredientid]
                }),
                client.query({
                    text: `
                        DELETE FROM
                            ingredients
                        WHERE
                            ingredient_id = $1`,
                    values: [ingredientid]
                })
            ])
            await client.query('COMMIT')

        } catch(e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
            res.redirect("/ingredients");
        }
});

// GET full list of ingredients
exports.ingredientList = asyncHandler( async (req, res) => {
    const ingredients = await pool.query("SELECT * FROM ingredients");
    res.render("ingredientlist", { title: "Ingredient List", ingredients: ingredients.rows });
});