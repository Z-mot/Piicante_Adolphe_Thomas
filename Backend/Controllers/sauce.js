//importation du model Sauce et de file system
const Sauce = require("../Models/sauce");
const fs = require("fs");

//création des controllers (logique métier) de chaque route de l'API

//création du controller pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//création du controller pour récupérer les informations d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//création du controller pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    /*transformation en objet du corps de la requête 
    afin de pouvoir ajouter une image (car le json ne peut pas transférer d'image 
    mais le form-data si*/
    const sauceObject = JSON.parse(req.body.sauce);
    //suppression de l'userId de l'objet provenant du client (pour le remplacer par celui du token)
    delete sauceObject.userId;
    //création d'une nouvelle instance de notre modèle Sauce
    const sauce = new Sauce({
        //utilisation de la syntaxe de décomposition (spread) pour récupérer la totalité des propriétés du modèle Sauce
        ...sauceObject,
        /*assignation de l'userId provenant du Token d'authentification en lieu et place 
        de celui provenant du corps de la requête*/
        userId: req.auth.userId,
        //recréation du chemin du stockage de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`,  
        //initialisation des likes et dislikes à 0
        likes: 0,
        dislikes: 0
    });
    //sauvegarde de la sauce ainsi crée via la méthode .save
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce créée !" }))
        .catch(error => res.status(400).json({ error }));
};

//création du controller permettant la modification d'une sauce
exports.modifySauce = (req, res , next) => {
    /*ici deux choix possible lors de la modification :
        on modifie l'image => ce qui nous donne une requête à transformer en form-data pour pouvoir transmettre l'image
        on modifie uniquement les champs => ce qui nous donne une requête "classique" en json et donc on récupére uniquement le reqbody*/
    const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    } : { ...req.body };
    //suppression de l'userId de l'objet provenant du client (pour le remplacer par celui du token)
    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //test pour savoir si l'utilisateur souhaitant modifier la sauce est bien son créateur
            if(sauce.userId != req.auth.userId) {
                //ici non donc code 403 non autorisé
                res.status(403).json({ message : "Non Autorisé" })
            } else {
                // sinon on enregistre les modification dans la BDD
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch(error => res.status(400).json({ error })); 
            }
        })
        .catch(error => res.status(400).json({ error }));
};

//création du controller pour la suppression d'une sauce
exports.deleleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //test pour savoir si l'utilisateur souhaitant supprimer la sauce est bien son créateur
            if (sauce.userId != req.auth.userId) {
                //ici non donc code 403 non autorisé
                res.status(403).json({ message: "Non Autorisé" })
            } else {
                //sinon en plus de supprimer la sauce nous devons supprimer l'image liée du dossier de stockage
                //ici nous récupérons le nom de l'image à supprimer
                const filename = sauce.imageUrl.split("/Images/")[1];
                /*là nous utilisons la fonction unlink du package fs pour supprimer l'image via le premier paramètre
                puis nous lui assignons en callback la suppression de la sauce*/
                fs.unlink(`Images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id})
                        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
                        .catch(error => res.status(500).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//création du controller pour le système de like/dislike des sauces
exports.like = (req, res, next) => {
    const voted = req.body.like;
    const user = req.body.userId;
    //déclaration de deux arrays vide pour les likes et dislikes
    let tabLikes = [];
    let tabDislikes= [];
    //nous récupérons la sauce dans la BDD
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //nous assignons à nos arrays vides la valeur de usersLiked et usersDisliked
            tabLikes = sauce.usersLiked;
            tabDislikes = sauce.usersDisliked;
            //si l'user est déjà dans l'array tabLikes
            if (tabLikes.indexOf(user) != -1) {
                //l'utilisateur a déjà liké
                if (voted == 0) {
                    /*mais si le like de la req.body envoyé est de 0, cela implique une modification de l'avis
                    et l'userId de l'utilisateur doit être supprimé du tableau correspondant afin de pouvoir
                    émettre un nouvel avis s'il le souhaite*/
                    const index = tabLikes.indexOf(user);
                    if (index > -1) { 
                        tabLikes.splice(index, 1); 
                    }
                }
            //si l'user n'est pas dans l'array tabLikes il est peut-être dans l'array tabDislikes
            } else {
                //si l'user est bien dans l'array tabDislikes
                if (tabDislikes.indexOf(user) != -1) {
                    //l'utilisateur à déjà disliké
                    if (voted == 0) {
                        /*mais si le like de la req.body envoyé est de 0, cela implique une modification de l'avis
                        et l'userId de l'utilisateur doit être supprimé du tableau correspondant afin de pouvoir
                        émettre un nouvel avis s'il le souhaite*/
                        const index = tabDislikes.indexOf(user);
                        if (index > -1) {
                            tabDislikes.splice(index, 1);
                        }
                    }
                //si l'user n'est dans aucun array
                } else {
                    // l'utilisateur n'a pas donné son avis
                    if (voted == 1) {
                        //si le like de la req.body envoyé est de 1, nous ajoutons l'userId dans l'array tabLikes
                        tabLikes.push(user);
                    } else {
                        //sinon nous ajoutons l'userId dans l'array tabDislikes
                        tabDislikes.push(user);
                    }
                }
            }

            // enfin nous mettons à jour la BDD, avec les valeurs correspondantes pour chaque propriétés MAJ
            Sauce.updateOne({ _id: req.params.id }, { likes: tabLikes.length, dislikes: tabDislikes.length , usersLiked: tabLikes, usersDisliked: tabDislikes, _id: req.params.id })
                .then(() => res.status(200).json({ message: "Sauce évaluée par l'user"}))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};
