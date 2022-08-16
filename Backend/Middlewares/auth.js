//importation de jsonwebtoken permettant de générer et décoder les tokens
const jwt = require("jsonwebtoken");

//exportation du middleware permettant la vérification du token utilisateur
module.exports = (req, res, next) => {
    //code à exécuter
    try {
        //récupération du token dans le header en enlevant le mot clé "bearer"
        const token = req.headers.authorization.split(" ")[1];
        //décodage du token grâce à la fonction verify de jsonwebtoken à l'aide du mot secret
        const decodedToken = jwt.verify(token, "YOU_NEVER_FIND_IT");
        //assignation de l'userId du token décodé à une constante
        const userId = decodedToken.userId;
        /*ajout du userId provenant du token à l'objet request afin 
        qu'il soit exploitable par toutes les routes*/
        req.auth = { userId: userId };
        //si tout se passe bien, fonction next pour continuer l'exécution du code
        next();
    //exception (erreur)
    } catch (error) {
        res.status(401).json({ error });
    }
};