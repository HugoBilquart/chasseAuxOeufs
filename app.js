var fs = require('fs');

var express = require('express')
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

//Dossier ressources (images, css, js)
app.use('/', express.static('ressources'));

//Page par défaut
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('ready', function() {
        socket.countEgg = 10;
        console.log(socket.countEgg + ' oeuf(s) à trouvé');
        console.log('Début de la partie');
        socket.emit('start',socket.countEgg);
    });

    socket.on('eggFound', function() {
        socket.countEgg--;
        console.log(socket.countEgg + ' oeuf(s) à trouvé');
        if(socket.countEgg == 0) {
            socket.emit('finished');
            console.log('Partie terminée');
        }
    });
});

server.listen(8000);