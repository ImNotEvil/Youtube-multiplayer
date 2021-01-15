var express = require("express");
var app = express();
const fs = require('fs');
var SSE = require('express-sse');
var sse = new SSE();

var {
    exec
} = require('child_process');

var Cvlc = require('cvlc');
var player = new Cvlc();


/// Definiton des variables :

var liste_des_musiques = [];
var index_des_musiques = [];
var playlist = "";
var playlist_temp = "";
sse.updateInit(playlist);
var action_possible = true;

///////////////////////////////////////////////////
//Lecture playlist en boucle :

function update_playlist() {

    var regExp = /(\W{4}\d+ - )(\N+)( \(\d{2}:\d{2}:\d{2}\) \[played \d+ times\])/;

    player.cmd('playlist', function gotCommands(err, response) {

        if (response != playlist_temp) {

            var arrayOfLines = response.match(/[^\r\n]+/g);
            arrayOfLines = arrayOfLines.splice(2, arrayOfLines.length - 4);

            var regExp = /(\W{4}\d+ - )(.*)( \(\d+:\d+:\d+\) \[played \d+ times*\])/;
            var regExp2 = /(\W{4})(\d+)( - )(.*)/;

            var total = "<hr>";
            index_des_musiques = [];
            arrayOfLines.forEach((item, i) => {
                var match = item.match(regExp);
                var match2 = item.match(regExp2);
                var indexe = match2[2];
                index_des_musiques.push(indexe);
                if (match) {
                    if (match[1].includes("*")) {
                        total += "<div onlick='play(" + indexe + ")' style='background:rgb(83,163,236)'>" + match[2] + "</div><hr>";
                    } else {
                        total += "<div onclick='play(" + indexe + ")' >" + match[2] + "</div><hr>";
                    }
                } else {
                    total += "<div onclick='play(" + indexe + ")' ><em>Titre inconnu</em></div><hr>";
                }
            });
            playlist_temp = response;
            playlist = total;
        }

        sse.updateInit(playlist);
        sse.send(playlist, 'playlist');
    });
}


//PLAYLIST
(async function() {
    setInterval(function() {
        update_playlist();
    }, 10000);
})();

async function lock() {
    action_possible = false;
    sse.send('locked', 'LOCK');
    setTimeout(function() {
        update_playlist();
        action_possible = true;
        sse.send('unlock', 'FREE');
    }, 3000);
}


////////////////////////////////////////////////////
//VLC CONTROL

//Ajoute la musique
app.post("/enqueue", (req, res) => {
    console.log("/enqueue");
    res.send("enqueue");
    var url = req.query.url;
    console.log("enqueue l'url : ", url)
    var code = extractVideoID(url);
    if (!liste_des_musiques.includes(code)) {

        liste_des_musiques.push(url);
        player.cmd('enqueue ' + url, function startedLocalFile() {
            update_playlist();
        });
    }
})

//Ajoute la musique
app.post("/clear", (req, res) => {
    console.log("/clear");
    res.send("clear");
    player.cmd('clear', function startedLocalFile() {
        update_playlist();
    });
})


//Next song
app.post("/next", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/next");
        player.cmd('next', function startedLocalFile() {});
    }
    res.send("next");
})
//Previous song
app.post("/back", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/back");
        player.cmd('prev', function startedLocalFile() {});
    }
    res.send("back");
})

//Pause la lecture de la musique
app.post("/pause", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/pause");
        player.cmd('pause', function startedLocalFile() {});
    }
    res.send("pause");

})
//Resume la lecture de la musique
app.post("/resume", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/resume");

        player.cmd('pause', function startedLocalFile() {});
    }
    res.send("resume");
})
//Play playlist
app.post("/start", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/start");
        player.cmd('play', function startedLocalFile() {});
    }
    res.send("start");

})
//Play playlist item X
app.post("/play", (req, res) => {
    if (action_possible) {
        lock();
        //
        console.log("/play");
        var numero = req.query.numero;
        if (index_des_musiques.includes(numero)) {
            player.cmd(`goto ${numero}`, function startedLocalFile() {});
        }
    }
    res.send("play");
})


///////////////////////////////////////////////////
//BASH

//Augement/Diminiue le volume sonore
app.post("/volume-up", (req, res) => {
    console.log("/volume-up");
    res.send("volume-up");

    const ls = exec('amixer set Master 10%+');

})
app.post("/volume-down", (req, res) => {
    console.log("/volume-down");
    res.send("volume-down");

    const ls = exec('amixer set Master 10%-');

})
//Connexion bluetooth
app.post("/bluetooth", (req, res) => {
    console.log("/bluetooth");
    res.send('Connexion bluetooth');

    const {
        exec
    } = require('child_process');
    try {
        exec('bash connect_bluetooth.sh');
    } catch (e) {
        //
    }
})
//Stop la lecture de la musique
app.post("/stop", (req, res) => {
    console.log("/stop");
    res.send("stop");
    player.cmd('shutdown', function gotCommands(err, response) {

    });
    const ls = exec('pkill node');
})



/////////////////////////////////////////////////////////
//Server

app.get('/playlist-info', sse.init);

app.use('/ressources', express.static(__dirname + '/Site/ressources'));
//IF serveur UP
app.get("/", (req, res) => {
    console.log("/");
    res.sendFile(__dirname + "/Site/index.html")
})
app.listen(8080, () => {
    console.log("HTTP Server started on port 8080");
    player.cmd('volume 100', function gotCommands(err, response) {

    });
    player.cmd('loop on', function gotCommands(err, response) {

    });
    player.cmd('clear', function gotCommands(err, response) {

    });

})

////////////////////////////////////////////////////////////:

function extractVideoID(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        return "false";
    }
}
