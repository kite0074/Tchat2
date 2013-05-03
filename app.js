var express = require('express');
var app = express();
var http = require('http');
// Express 3.0 comptability: https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
// Notre application ecoute sur le port 8040
var server = http.createServer(app).listen(8040);;
var io = require('socket.io').listen(server);


// Configuration

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// Variables globales
// Ces variables resteront durant toute la vie du seveur pour et sont commune pour chaque client (node server.js)
// liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {
    // On donne la liste des messages (evenement cree du cote client)
    socket.emit('recupererMessages', messages);
    // Quand on recoit un nouveau message
    socket.on('nouveauMessage', function (mess) {
        // On l'ajout au tableau (variable globale commune a tous les clients connectes au serveur)
        messages.push(mess);
        // On envoie a tout les clients connectes (sauf celui qui a appelle l'evenement) le nouveau message
        socket.broadcast.emit('recupererNouveauMessage', mess);
    });
});

///////////////////

console.log('Live Chat App running at http://localhost:8040/');