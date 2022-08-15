// importation d'express pour pouvoir utiliser sa fonction Router
const express = require("express");
//importation du controller user (logique métier)
const userCtrl = require("../Controllers/user");

// assignation de la fonction Router d'express à une constante
const router = express.Router();

//déclaration des endpoints avec assignation à chaque controller
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//exportation du module router afin de rendre disponibles ces routes dans d'autres fichiers
module.exports = router;