const { Router } = require("express");
const tagsRouter = Router();

const tagcontroller = require("../controllers/tagController");

// GET full list of tags
tagsRouter.get("/", tagcontroller.tagList);

// handle GET for tag creation form
tagsRouter.get("/create", tagcontroller.createTagGet);

// handle POST for tag creation form
tagsRouter.post("/create", tagcontroller.createTagPost);

// handle GET for tag update form
tagsRouter.get("/update/:id", tagcontroller.updateTagGet);

// handle POST for tag update form
tagsRouter.post("/update/:id", tagcontroller.updateTagPost);

// handle GET for tag deletion form
tagsRouter.get("/delete/:id", tagcontroller.deleteTagGet);

// handle POST for tag deletion form
tagsRouter.post("/delete/:id", tagcontroller.deleteTagPost);

// tag GET for one tag
// this route needs to be last
tagsRouter.get("/:id", tagcontroller.getTag);

module.exports = tagsRouter;