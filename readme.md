# Archipix

## Description

Ce projet est un système de stockage de fichiers en ligne destiné aux photographes professionnels. Il permet aux utilisateurs de télécharger, organiser et partager leurs fichiers en toute sécurité.

## Fonctionnalités

- Téléchargement de fichiers
- Création de dossiers
- Partage de fichiers et de dossiers
- Modification et suppression de fichiers et de dossiers

## Utilisateurs Cibles

Ce projet est destiné aux photographes professionnels qui ont besoin d'un système de stockage en ligne sécurisé pour gérer leurs fichiers et leurs projets.

## Technologies Utilisées

- Frontend : React
- Backend : Node.js
- Base de données : MySQL
- Stockage des fichiers : AWS S3
- Authentification : JSON Web Tokens (JWT)

## Installation

1. Clonez le dépôt :
   `git clone https://github.com/natharyu/Archipix.git`
2. Naviguez dans le dossier `Archipix` :
   `cd Archipix`
3. Installez les dépendances :
   `cd back && npm install && cd ../front && npm install`
4. Configurez les variables d'environnement :
   `cd back && cp .env.example .env && cd ../front && cp .env.example .env`
   Ensuite modifier les fichier .env avec vos paramètres d'environnement.
5. Lancez le serveur :
   ouvrez 2 terminaux et lancer les commandes suivantes pour lancer le serveur :
   `cd back && npm start`
   `cd front && npm run build`
