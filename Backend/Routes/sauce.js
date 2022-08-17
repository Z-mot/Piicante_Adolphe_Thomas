const express = require("express");
const auth = require("../Middlewares/auth");
const multer = require("../Middlewares/multer-config");
const sauceCtrl = require("../Controllers/sauce");

const router = express.Router();

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleleteSauce);

module.exports = router;