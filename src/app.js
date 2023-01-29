const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(authRoutes)


app.use((req, res) => {
    res.status(404).json({ code: "not-found", message: "Path wasn't found" });
});


app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});




module.exports = app;