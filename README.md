# Welcome to Youtube Multiplayer

Hi! I'm going to show you my youtube multiplayer app for Raspberry Pi
The goal is simple, connect a bluetooth device to your Raspberry Pi, run the server and enjoy a party where everyone can control the speaker and add their own youtube song.


## Installation

### Requirement

Have a Raspberry Pi (or any Unix device)
Have a Bluetooth speaker
Have nodejs and npm installed on your device

That's it.

### Procedure

Copy the Website folder on your raspberry Pi and go into it.

Then you have to install all depedencies running this :
> npm install express
>  npm install express-sse
>  npm install cvlc

Then you have to modify the 4th line of `connect_bluetooth.sh` file
Change the **78:44:05:9F:69:C1** to the mac address of your bluetooth device

**You dont know what it is, how to connect, go there and find yourself [here](https://www.cnet.com/how-to/how-to-setup-bluetooth-on-a-raspberry-pi-3/)**

That's about it, you can also use nodemon  if you want. Now just run :
> node server.js


## Website

Well to have people add their stuff we need a server so here we go !

Use your phone or pc, go to your favorite navigator and just type the server ip and voila, all set. Just put some youtube video url and you will see it apper.

> Note that vlc do not know anything about the title before any song is played so I decided to show **Titre Inconnu** instead, vlc will update it by itself

**Warning** if you play an unknown song and skip it when it starts playing it might not be playable later because it just kill vlc, **the song will not be considered or played again ever**. Since I've put a non duplicate rule, you will not be able to add it again so be **PATIENT** when playing a song for its first time.



## Android App

I also redirected my website to my Raspberry Pi so I can access it via local network and external network.

Goals for later :

![plot](https://github.com/ImNotEvil/Youtube-multiplayer/blob/main/Android%20App/flowchart.PNG?raw=true)
