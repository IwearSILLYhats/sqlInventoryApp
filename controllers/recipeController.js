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
exports.createRecipeGet = asyncHandler ( async (req, res) => {

    const [tags, ingredients] = await Promise.all([
        query ("SELECT tag_id AS id, tag AS name from tags"), 
        query ("SELECT ingredient_id AS id, ingredient_name AS name from ingredients")]);

    res.render("recipeForm", {
        title: "Create a recipe",
        tags: tags.rows,
        ingredients: ingredients.rows
    })
});

// handle POST for recipe creation form
// WIP
exports.createRecipePost = [
    recipeValidation,
    asyncHandler( async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            const [tags, ingredients] = await Promise.all([
                query ("SELECT tag_id AS id, tag AS name from tags"), 
                query ("SELECT ingredient_id AS id, ingredient_name AS name from ingredients")]);
            compareLists(tags.rows, req.body.tags);
            compareLists(ingredients.rows, req.body.ingredients);

            return res.render("recipeForm", {
                title: "Create a recipe",
                tags: tags.rows,
                ingredients: ingredients.rows,
                recipe: {
                    recipe_name: req.body.name,
                    recipe_description: req.body.description
                },
                errors: errors
            })
        }
        else {
            const newRecipe = await query({
                text:"INSERT INTO recipes (recipe_name, recipe_description) VALUES ($1, $2) RETURNING recipe_id",
                values: [req.body.name, req.body.description]
            });
            // TO DO - replace query with pool to enable transactions for junction tables
        }
    })
]

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

function compareLists (fullList, selected) {
    fullList.forEach(item => {
        if (selected.includes(item.id)) {
            item.checked = true;
        }
    })
};