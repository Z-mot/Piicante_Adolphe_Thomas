const Sauce = require("../Models/sauce");
const fs = require("fs");
const sauce = require("../Models/sauce");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: "${req.protocol}://${req.get('host')}/Images/${req.file.filename}"
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce créée !" }))
    .catch(error => res.status(400).json({ error }));
    };