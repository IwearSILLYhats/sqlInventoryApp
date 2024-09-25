require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();

const ingredientRouter = require("./routes/ingredientRouter");
const recipeRouter = require("./routes/recipeRouter");
const tagRouter = require("./routes/tagRouter");
const indexRouter = require("./routes/indexRouter");

app.set("view", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/ingredients", ingredientRouter);
app.use("/recipes", recipeRouter);
app.use("/tags", tagRouter);
app.use("/", indexRouter);