const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const query = require("../db/pool");

const tagValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Tag name must be alphanumeric")
    .isLength(3).withMessage("Tag name must be at least 3 characters"),
    body("description").trim().escape()
    .optional()
];

// tag GET for one tag
exports.getTag = asyncHandler(async (req, res) => {
    const tag = await query(`SELECT * FROM tags WHERE id = ${req.params.id}`);
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
                tag: req.body
            });
        }
        await query(`INSERT INTO tags (name, description)
            VALUES ('${req.body.name}', '${req.body.description}')`);
        res.redirect("/tags");
    })
];

// handle GET for tag update form
exports.updateTagGet = asyncHandler( async (req, res, next) => {
    const tag = await query(`SELECT * FROM tags WHERE id = ${req.params.id}`);
    if (tag === null) {
        return res.redirect("/tags")
    }
    res.render("tagForm", {title: "Update Tag", tag: tag.rows[0]});
});

// handle POST for tag update form
exports.updateTagPost = [
    tagValidation,
    asyncHandler( async (req, res) => {

})];

// handle GET for tag deletion form
exports.deleteTagGet = (req, res) => {

};

// handle POST for tag deletion form
exports.deleteTagPost = (req, res) => {

};

// GET full list of tags
exports.tagList = asyncHandler(async (req, res, next) => {
    const tags = await query("SELECT * FROM tags");
    res.render("taglist", { title: "Taglist", tags: tags.rows });
});