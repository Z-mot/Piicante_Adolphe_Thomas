//importation de mongoose et de mongoose-unique-validator
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//création du schéma utilisateur avec la Class Schema du module mongoose
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

/*utilisation de la méthode plugin de notre schéma qui prend en paramètre
notre constante uniqueValidator afin de garantir chaque schéma unique*/
userSchema.plugin(uniqueValidator);

/*exportation de notre schéma via la fonction model de mongoose afin
de rendre ce schéma disponible dans d'autres fichiers*/
module.exports = mongoose.model("User", userSchema);