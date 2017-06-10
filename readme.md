## Description du projet

Ce projet de bataille navale s'inscrit dans le cadre du cours IN104 de première année à l'ENSTA ParisTech.

Il est réalisé sous forme d'une application web accessible à https://battleship.data-ensta.fr
Il est possible de jouer à 2 en réseau, ou tout seul face à une IA présente sur le serveur.

## Technologies utilisées

* Backend : `NodeJS, Express, EJS`
* Frontend : `HTML, CSS, Bootstrap, VueJS`
* Communication temps-réel client-server : `socket.io`

## Installation en local

Pour lancer le serveur il vaut que `nodejs` et `npm` soient installés sur votre PC : `apt install nodejs npm`

Après avoir cloné le dépôt, lancer `npm install` à la racine du projet pour installer les dépendances.
Lancer le serveur en exécutant `node server.js`

Accédez au jeu via un navigateur à l'adresse : `http://localhost:8000`
