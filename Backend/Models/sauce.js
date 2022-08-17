//exportation de mongoose
const mongoose = require("mongoose");

//création du schema sauce
const sauceSchema = mongoose.Schema({
    //identifiant MongoDB unique
    userId: { type: String, required: true },
    //nom de la sauce
    name: { type: String, required: true },
    //fabricant de la sauce
    manufacturer: { type: String, required: true },
    //description de la sauce
    description: { type: String, required: true },
    //principal ingrédient épicé de la sauce
    mainPepper: { type: String, required: true },
    //l'url de l'image de la sauce
    imageUrl: { type: String, required: true },
    //note de la sauce
    heat: { type: Number },
    //nombre d'utilisateur qui aiment la sauce
    likes: { type: Number },
    //nombre d'utilisateur qui n'aiment pas la sauce
    dislikes: { type: Number },
    //tableau des identifiants des utilisateurs qui ont aimé la sauce
    userLiked: { type: Array },
    //tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
    userDisliked: { type: Array }
});

module.exports = mongoose.model("Sauce", sauceSchema);