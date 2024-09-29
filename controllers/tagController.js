const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/pool");

const tagValidation = [
    body("name").trim().escape()
    .isAlphanumeric().withMessage("Tag name must be alphanumeric")
    .isLength(3).withMessage("Tag name must be at least 3 characters"),
    body("description").trim().escape()
    .isAlphanumeric().withMessage("Description must be alphanumeric")
    .optional()
];

// tag GET for one tag
exports.getTag = asyncHandler(async (req, res) => {
    const tag = await db.query(`SELECT * FROM tags WHERE id = ${req.params.id}`);
    res.render("tagDetail", { tagData: tag.rows[0]});
})

// handle GET for tag creation form
exports.createTagGet = (req, res) => {
    res.render("tagForm");
};

// handle POST for tag creation form
// WIP
exports.createTagPost = [
    tagValidation,
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render("tagForm", {
                title: "Create New Tag",
                errors: errors.array(),
                tag: req.body
            });
        }

    }
];

// handle GET for tag update form
exports.updateTagGet = (req, res) => {

};

// handle POST for tag update form
exports.updateTagPost = (req, res) => {

};

// handle GET for tag deletion form
exports.deleteTagGet = (req, res) => {

};

// handle POST for tag deletion form
exports.deleteTagPost = (req, res) => {

};

// GET full list of tags
exports.tagList = asyncHandler(async (req, res) => {
    const tags = await db.query("SELECT * FROM tags");
    res.render("taglist", { tags: tags.rows });
});