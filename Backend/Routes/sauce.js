/*importation de : express, des Middlewares auth(pour l'authentification par token)
 et multer-config(pour la prise en charge des fichiers images), du controller sauce qui contient 
 toutes les logiques métiers*/
const express = require("express");
const auth = require("../Middlewares/auth");
const multer = require("../Middlewares/multer-config");
const sauceCtrl = require("../Controllers/sauce");

const router = express.Router();

/*implémentation de toutes les routes sauces de l'API avec en premier paramètre
le end-point, suivi du middleware d'authentification pour renforcer la sécurité
puis du middleware multer pour les routes utilisant la gestion de fichier image
et enfin de tous les middleware comprenant les logiques métiers propre à chaque route*/
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleleteSauce);
router.post("/:id/like", auth, sauceCtrl.like);

//exportation des routes afin qu'elles soient utilisées dans d'autres fichiers
module.exports = router;