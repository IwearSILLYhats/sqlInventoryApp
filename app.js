require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/indexRouter");
const tagRouter = require("./routes/tagRouter");
const recipeRouter = require("./routes/recipeRouter");
const ingredientRouter = require("./routes/ingredientRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, '/public')));

app.use("/", indexRouter);
app.use("/tags", tagRouter);
app.use("/recipes", recipeRouter);
app.use("/ingredients", ingredientRouter);
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
