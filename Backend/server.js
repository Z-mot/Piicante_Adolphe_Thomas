/*importation du module http pour la création du serveur 
et du fichier app.js*/
const http = require("http");
const app = require("./app");

//normalizePort renvoie un port valide
const normalizePort = val => {
    //défini port comme un nombre entier en base décimal
    const port = parseInt(val, 10);
    //si le port n'est pas un nombre retourner la valeur
    if (isNaN(port)) {
        return val;
    }
    //si le port est un nombre supérieur à zéro retourner le port
    if (port >= 0) {
        return port;
    }
    return false;
};
/*on définit port comme un port valide correspondant soit à la cariable d'environnement du port 
ou soit le port 3000*/
const port = normalizePort(process.env.PORT || '3000');
//lancement de la constante port en la définissant par "port"
app.set('port', port);

//mise en place d'un écouteur d'événement pour les erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

//mise en route de l'écouteru d'événement, si l'événement est une erreur, alors exécuter la constante errorHandler
server.on('error', errorHandler);
//si l'événement est "listening", alors éxécuter la fonction suivante
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    //mise en place d'un message dans la console pour connaitre le port d'éxécution du serveur
    console.log('Listening on ' + bind);
});

//mise en route du serveur
server.listen(port);