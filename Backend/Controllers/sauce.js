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
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,  
        likes: 0,
        dislikes: 0
    });
    console.log(sauce);
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
        .then(sauce => {
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

exports.like = (req, res, next) => {
    const voted = req.body.like;
    const user = req.body.userId;
    let tabLikes = [];
    let tabDislikes= [];

    //récupérer la sauce dans la BDD
    //récupérer le tableau d'usersLiked et usersDisliked
    //vérifier l'action de l'utilisateur : si l'utilisateur à déjà émis un vote il sera dans l'un des deux array
    //mettre à jour la BDD
    //tabLikes.push( user );
    //tabDislikes.push(user);
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            tabLikes = sauce.usersLiked;
            tabDislikes = sauce.usersDisliked;
            if (tabLikes.indexOf(user) != -1) {
                //l'user a déjà liké
                if (voted == 0) {
                    const index = tabLikes.indexOf(user);
                    if (index > -1) { 
                        tabLikes.splice(index, 1); 
                    }
                }
            } else {
                if (tabDislikes.indexOf(user) != -1) {
                    //l'user à déjà disliké
                    if (voted == 0) {
                        const index = tabDislikes.indexOf(user);
                        if (index > -1) {
                            tabDislikes.splice(index, 1);
                        }
                    }
                } else {
                    // l'user n'a pas donné son avis
                    if (voted == 1) {//like
                        tabLikes.push(user);
                    } else {//dislike
                        tabDislikes.push(user);
                    }
                }
            }
            console.log(tabLikes.length, tabDislikes.length);
            //mettre à jour la sauce dans la BDD
            Sauce.updateOne({ _id: req.params.id }, { likes: tabLikes.length, dislikes: tabDislikes.length , usersLiked: tabLikes, usersDisliked: tabDislikes, _id: req.params.id })
                .then(() => res.status(200).json({ message: "Sauce évaluée par l'user"}))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};
