const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./Routes/user");
const sauceRoutes = require("./Routes/sauce");
const app = express();

mongoose.connect("mongodb+srv://Thomas:Piicante@cluster0.vyp4r4a.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connexion à MongoDB Atlas réussi :D"))
    .catch(() => console.log("Connexion à MongoDB Atlas échouée :("));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/Images", express.static(path.join(__dirname, "images")));

module.exports = app;