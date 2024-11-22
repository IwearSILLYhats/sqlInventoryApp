const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pool");

const recipeValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Recipe name must be alphanumeric")
    .isLength(3).withMessage("Recipe name must be at least 3 characters"),
    body("tags"),
    body("ingredients"),
    body("description").trim().escape()
    .optional()
];

// recipe GET for one recipe
exports.getRecipe = asyncHandler( async (req, res) => {

    const [recipe, ingredients, tags] = await Promise.all([
        pool.query({
            text: `
                SELECT * FROM recipes 
                WHERE recipe_id = $1`,
            values: [req.params.id]
        }),
        pool.query({
            text: `
                SELECT * FROM recipeingredients
                INNER JOIN
                    ingredients
                ON
                    ingredientid = ingredient_id
                WHERE
                    recipeid = $1`,
            values: [req.params.id]
        }),
        pool.query({
            text: `
                SELECT * FROM tagrecipes
                INNER JOIN
                    tags
                ON
                    tagid = tag_id
                WHERE
                    recipeid = $1`,
            values: [req.params.id]
        })
    ]);

    if(recipe.rows[0] === undefined) {
        return res.redirect("/recipes");
    }
    res.render("recipeDetail", {
        title: "Recipe Detail",
        recipe: recipe.rows[0],
        ingredients: ingredients.rows,
        tags: tags.rows
    });
});

// handle GET for recipe creation form
exports.createRecipeGet = asyncHandler ( async (req, res) => {

    const [tags, ingredients] = await Promise.all([
        pool.query (`
            SELECT tag_id AS id, tag AS name from tags`), 
        pool.query (`
            SELECT ingredient_id AS id, ingredient_name AS name from ingredients`)]);

    res.render("recipeForm", {
        title: "Create a recipe",
        tags: tags.rows,
        ingredients: ingredients.rows
    })
});

// handle POST for recipe creation form
// WIP
exports.createRecipePost = [
    // Validate and sanitize form output
    recipeValidation,
    asyncHandler( async (req, res) => {
        // Check for errors and rerender form with error info if any are found
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            let [tags, ingredients] = await Promise.all([
                pool.query({
                    text:`
                        SELECT 
                            tag_id AS id,
                            tag AS name
                        FROM 
                            tags`
                }), 
                pool.query({
                    text: `
                        SELECT 
                            ingredient_id AS id,
                            ingredient_name AS name
                        FROM 
                            ingredients`
                })
            ]);

            // Compare tag and ingredient list to form output so that boxes stay checked
            if(typeof req.body.tags !== "undefined") {
                tags.rows.forEach(tag => {
                    tag.checked = [...req.body.tags].includes(tag.id.toString());
                });
            }
            if(typeof req.body.ingredients !== "undefined") {
                ingredients.rows.forEach(ingredient => {
                    ingredient.checked = [...req.body.ingredients].includes(ingredient.id.toString());
                });
            }

            // Rerender form, including already entered data and error info
            return res.render("recipeForm", {
                title: "Create a recipe",
                tags: tags.rows,
                ingredients: ingredients.rows,
                recipe: {
                    recipe_name: req.body.name,
                    recipe_description: req.body.description
                },
                errors: errors.array()
            })
        }
        // Begin transaction since this needs to be an all or nothing update
        else {
            const client = await pool.connect();
            try{
                await client.query('BEGIN');

                const newRecipe = await client.query({
                    text:"INSERT INTO recipes (recipe_name, recipe_description) VALUES ($1, $2) RETURNING recipe_id",
                    values: [req.body.name, req.body.description]
                });
                console.log(generateInsertSql(newRecipe.rows[0].recipe_id, [...req.body.tags]));
                if(typeof req.body.tags !== "undefined" && req.body.tags.length > 0) {
                    await client.query({
                        text: `
                        INSERT INTO tagrecipes (recipeid, tagid)
                        VALUES
                            ${generateInsertSql(newRecipe.rows[0].recipe_id, [...req.body.tags])}
                        ON CONFLICT DO NOTHING`,
                        values: []
                    })
                }
                if(typeof req.body.ingredients !== "undefined" && req.body.ingredients.length > 0) {
                    await client.query({
                        text: `
                        INSERT INTO recipeingredients (recipeid, ingredientid)
                        VALUES
                            ${generateInsertSql(newRecipe.rows[0].recipe_id, [...req.body.ingredients])}
                        ON CONFLICT DO NOTHING`,
                        values: []
                    })
                }
                

                await client.query('COMMIT')

            } catch(e) {
                await client.query('ROLLBACK')
                throw e
            } finally {
                client.release()
                res.redirect("/recipes");
            }
        }
    })
];

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
    const recipes = await pool.query("SELECT * FROM recipes");
    res.render("recipelist", { title: "Recipe List", recipes: recipes.rows });
});

function generateInsertSql (mainColumn, secondColumn) {
    let junctionArray = secondColumn.map(id => `(${mainColumn}, ${id})`)
    return junctionArray.join(", ");
}