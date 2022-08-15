//importation de bcrypt pour hacher les mdp
const bcrypt = require("bcrypt");
//importation de jsonwebtoken pour pouvoir créer un token lors d'une connexion utilisateur
const jwt = require("jsonwebtoken");
//importation du schéma utilisateur
const User = require("../Models/user");

//création et export du middleware lié à la création d'un utilisateur
exports.signup = (req, res, next) => {
    //utilisation de la fonction hash de bcrypt afin d'hacher le mdp
    bcrypt.hash(req.body.password, 15)
        //si promise tenue (réponse)
        .then(hash => {
            /*ici, si nous avons une réponse à notre requête nous créons une instance
            du userSchema en remplaçant le mdp rentré par un hachage de ce dernier*/
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //suite à la création d'un nouvel utilisateur, on l'enregistre
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch( error => res.status(400).json({ error }));
        })
        //si promise en erreur
        .catch(error => res.status(500).json({ error }));
};

//création et export du middleware lié à la connection d'un utilisateur
exports.login = (req, res, next) => {
    /*utilisation de la méthode findOne du userSchema afin de 
    retrouver l'addresse mail de l'utilisateur*/
    User.findOne({ email: req.body.email })
        //si promise tenue (réponse)
        .then(user => {
            //si l'utilisateur n'est pas dans la base de donnée
            if(!user) {
                //on retourne un code erreur 401 "non autorisé" ainsi qu'un message d'erreur
                return res.status(401).json({ message: "Login et/ou mot de passe incorrect"})
            } else {
                /*sinon on utilise la fonction compare de bcrypt entre le mdp saisie par
                l'utilisateur et le mdp enregistré dans la base de donnée ( les 2 mdp sont hachés)*/
                bcrypt.compare(req.body.password, user.password)
                    //si promise tenue (réponse)
                    .then(valid => {
                        //si la comparaison est infructueuse
                        if(!valid) {
                            //on retourne un code erreur 401 "non autorisé" ainsi qu'un message d'erreur
                            return res.status(401).json({ message: "Login et/ou mot de passe incorrect"})
                        } else {
                            /*sinon on retourne un code OK ainsi qu'une réponse JSON comprenant
                            l'userID ainsi qu'un token composé du userId, d'un mot secret permettant 
                            d'encoder le token et d'une date d'expiration du token*/
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
                    //si promise en erreur
                    .catch(error => res.status(501).json({ error }));
            };  
        })
        //si promise en erreur
        .catch(error => res.status(500).json({ error }));
};