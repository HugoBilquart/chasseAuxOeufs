const sqlite3 = require('sqlite3').verbose();
const date = require('date-and-time');

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

    socket.on('pseudo', function(pseudo,chrono) {
        let db = new sqlite3.Database('ranking/classement.sqlite');

        var now = new Date();
        var currentdate = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        db.run('INSERT INTO classement(date, pseudo, time) VALUES(?, ?, ?)', [currentdate,pseudo,chrono], (err) => {
            if(err) {
                return console.log(err.message); 
            }
            console.log('Score enregistré');
        });

        db.close();

        socket.emit('ranked');
    });
});

server.listen(8000);