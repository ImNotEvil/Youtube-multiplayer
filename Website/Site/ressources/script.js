function requete(commande) {
    var myElement = document.getElementById(commande);
    myElement.classList.add("shadow");
    setTimeout(function() {
        myElement.classList.remove("shadow");
    }, 2000);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    };
    xhttp.open("POST", commande, true);
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send();
}

var es = new EventSource('/playlist-info');

es.onerror = function(event) {
	document.getElementById("container").innerHTML = "Le serveur est éteint";
}
es.addEventListener('playlist', function (event) {
	document.getElementById("container").innerHTML = JSON.parse(event.data);
});
es.addEventListener('LOCK', function (event) {
	console.log('LOCK');
	fadein('lock')
	fadeout('unlock');
});
es.addEventListener('FREE', function (event) {
	console.log('FREE');
	fadeout('lock')
	fadein('unlock');
});


function youtube() {
    var myElement = document.getElementById("youtube");
    myElement.classList.add("shadow");
    setTimeout(function() {
        myElement.classList.remove("shadow");
    }, 2000);

    var url = document.getElementById('url').value;

    if (extractVideoID(url)) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                document.getElementById('url').value = "";
            }
        };
        xhttp.open("POST", "enqueue?url=" + url, true);
        xhttp.setRequestHeader("Content-type", "text/html");
        xhttp.send();
    }
}

function play(i) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "play?numero=" + i, true);
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send();
}


function extractVideoID(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return true;
    } else {
        return false;
    }
}

function fadein(id){
	document.getElementById(id).style.opacity = 1;
}
function fadeout(id){
	document.getElementById(id).style.opacity = 0.2;
}
