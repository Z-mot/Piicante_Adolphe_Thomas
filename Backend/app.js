/*importation de: express(pour l'application), mongoose(pour la connection à la BDD), path(pour le chemin statique),
les différentes routes afin de pouvoir les utiliser dans l'application */
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./Routes/user");
const sauceRoutes = require("./Routes/sauce");
const app = express();

//connection au server MongoDB Atlas via le lien du cluster fourni par MongoDB 
mongoose.connect("mongodb+srv://Thomas:Piicante@cluster0.vyp4r4a.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connexion à MongoDB Atlas réussi :D"))
    .catch(() => console.log("Connexion à MongoDB Atlas échouée :("));

/*utilisation de la méthode app.use prenant en paramètre le middleware express.json afin
de rendre disponible le body directement dans l'objet req pour toute les requêtes ayant
un content-type : application/json*/
app.use(express.json());

//utilisation d'un middleware permettant de contourner les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//accèder à l'API de n'importe où
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//possibilité d'ajouter les headers mentionés
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//possibilité d'envoyer des requêtes avec les méthodes mentionnés
    next();
});

/*utilisation des différentes routes avec comme premier paramètre le chemin commun à chaque route
puis en second paramètre le fichier contenant les différentes routes précédement importés*/
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
//utilisation de la méthode express.static afin de donner un chemin absolue vers le répertoire Images (où son enregistrée les images)
app.use("/Images", express.static(path.join(__dirname, "Images")));

//exportation de l'app pour qu'elle soit utilisable dans d'autre fichier
module.exports = app;