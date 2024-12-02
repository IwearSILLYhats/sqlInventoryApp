const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const pool = require("../db/pool");

const tagValidation = [
    body("name").trim().escape()
    .isLength(3).withMessage("Tag name must be at least 3 characters"),
    body("description").trim().escape()
    .optional()
];

// tag GET for one tag
exports.getTag = asyncHandler(async (req, res) => {
    const tag = await pool.query(`SELECT * FROM tags WHERE tag_id = ${req.params.id}`);
    if(tag === null) {
        res.redirect("/tags");
    }
    res.render("tagDetail", { title: "Tag Detail", tag: tag.rows[0]});
});

// handle GET for tag creation form
exports.createTagGet = (req, res) => {
    res.render("tagForm", { title: "Create a new tag" });
};

// handle POST for tag creation form
exports.createTagPost = [
    tagValidation,
   asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.render("tagForm", {
                title: "Create New Tag",
                errors: errors.array(),
                tag: {
                    tag: req.body.name,
                    tag_description: req.body.description
                }
            });
        }
        await pool.query(`INSERT INTO tags (tag, tag_description)
            VALUES ('${req.body.name}', '${req.body.description}')`);
        res.redirect("/tags");
    })
];

// handle GET for tag update form
exports.updateTagGet = asyncHandler( async (req, res, next) => {
    const tag = await pool.query(`SELECT * FROM tags WHERE tag_id = ${req.params.id}`);
    if (tag === null) {
        return res.redirect("/tags")
    }
    res.render("tagForm", {title: "Update Tag", tag: tag.rows[0]});
});

// handle POST for tag update form
exports.updateTagPost = [
    tagValidation,
    asyncHandler( async (req, res) => {
        const errors = validationResult(req);
        const tag = {
            id: req.params.id,
            tag: req.body.name,
            description: req.body.description
        };

        if (!errors.isEmpty) {
            return res.render("tagForm", {
                title: "Update Tag",
                tag: tag
            });
        }
        await pool.query({
            text: "UPDATE tags SET (tag, tag_description) = ($1, $2)WHERE tag_id = $3",
            values: [tag.tag, tag.description, tag.id]
        });
        res.redirect(`/tags/${tag.id}`);
})];

// handle GET for tag deletion form
exports.deleteTagGet = asyncHandler(async (req, res) => {
    const [recipes, tag] = await Promise.all([pool.query({
        text: `
            SELECT
                *
            FROM
                tagrecipes
            LEFT JOIN
                recipes
            ON
                recipeid = recipe_id
            WHERE
                tagid = $1`,
        values: [req.params.id]
        }),
        pool.query({
            text: `
                SELECT
                    *
                FROM
                    tags
                WHERE
                    tag_id = $1`,
            values: [req.params.id]
        })
    ])
    
    if(tag !== null) {
        res.render("tagDelete", {
            title: "Delete a tag",
            recipes: recipes.rows,
            tag: tag.rows[0]
        })
    }
    else {
        res.redirect("/tags")
    }
});

// handle POST for tag deletion form
exports.deleteTagPost = asyncHandler( async (req, res) => {
    const client = await pool.connect();
        try{
            const tagid = parseInt(req.body.id);

            await client.query('BEGIN');

            await Promise.all([
                client.query({
                    text: `
                        DELETE FROM
                            tagrecipes
                        WHERE
                            tagid = $1`,
                    values: [tagid]
                }),
                client.query({
                    text: `
                        DELETE FROM
                            tags
                        WHERE
                            tag_id = $1`,
                    values: [tagid]
                })
            ])
            await client.query('COMMIT')

        } catch(e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
            res.redirect("/tags");
        }
});

// GET full list of tags
exports.tagList = asyncHandler(async (req, res, next) => {
    const tags = await pool.query("SELECT * FROM tags");
    res.render("taglist", { title: "Tag List", tags: tags.rows });
});