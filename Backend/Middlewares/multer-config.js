//importation de multer package
const multer = require("multer");

//création d'une constante dictionnaire sur les mimetypes "images"
const MIME_TYPES = {
    "image/jpg":  "jpg",
    "image/jpeg": "jpg",
    "image/png":  "png"
};
/*création d'une contante permettant de choisir où enregistrer les fichiers "images"
ainsi que de renommer le fichier image*/
const storage = multer.diskStorage({
    //choisir la destination où sera enregistrer le fichier "image"
    destination: (req, file, callback) => {
        //null pour signifier aucune erreur suivi du dossier de destination
        callback(null, "Images");
    },
    //renommer le fichier dans un format standardisé
    filename: (req, file, callback) => {
        /*ici nous prenons le nom original du fichier puis nous remplaçons les espaces
        par des underscores (les espaces étant mal gérés dans les noms de fichiers côté serveur)*/
        let name = file.originalname.split(" ").join("_");
        console.log(file);
        /*ici nous créons notre extension de fichier en faisant correspondre le mimetype
        du fichier avec ceux de notre dictionnaire*/
        const extension = MIME_TYPES[file.mimetype];
        //je supprime l'extension faisant partie de l'originalname
        name = name.replace("." + extension, "");
        //null pour signifier aucune erreur puis création du nom de fichier
        callback(null, name + Date.now() + "." + extension);
    }
});

/*exportation du middleware avec la méthode multer qui donne la destination du fichier
et la méthode single pour spécifier que c'est un fichier et non un groupe de fichier
et surtout que sont acceptés uniquement des images*/
module.exports = multer({ storage: storage }).single("image");
