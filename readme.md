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
   `bash git clone https://github.com/natharyu/Archipix.git`
2. Installez les dépendances :
   `bash cd back && npm install && cd ../front && npm install`
3. Configurez les variables d'environnement :
   `bash cd back && cp .env.example .env && cd ../front && cp .env.example .env`
   Ensuite modifier les fichier .env avec vos paramètres d'environnement.
4. Lancez le serveur :
   ouvrez 2 terminaux et lancer les commandes suivantes :
   `bash cd back && npm start`
   `bash cd front && npm run build`
