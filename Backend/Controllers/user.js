//importation de bcrypt pour hacher les mdp
const bcrypt = require("bcrypt");
//importation de jsonwebtoken pour pouvoir créer un token lors d'une connexion utilisateur
const jwt = require("jsonwebtoken");
//importation du schéma utilisateur
const User = require("../Models/user");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch( error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ message: "Login et/ou mot de passe incorrect"})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid) {
                            return res.status(401).json({ message: "Login et/ou mot de passe incorrect"})
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    "YOU_NEVER_FIND_IT",
                                    { expiresIn: "24h" }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(501).json({ error }));
            };  
        })
        .catch(error => res.status(500).json({ error }));
};