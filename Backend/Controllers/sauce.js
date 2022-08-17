const Sauce = require("../Models/sauce");
const fs = require("fs");


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
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
       
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce créée !" }))
        .catch(error => res.status(400).json({ error }));
    };

exports.modifySauce = (req, res , next) => {
    const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if(sauce.userId != req.auth.userId) {
                res.status(403).json({ message : "Non Autorisé" })
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch(error => res.status(400).json({ error })); 
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Non Autorisé" })
            } else {
                const filename = sauce.imageUrl.split("/Images/")[1];
                fs.unlink(`Images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id})
                        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                        .catch(error => res.status(500).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};
