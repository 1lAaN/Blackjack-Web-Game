# KNR Blackjack

Jeu de Blackjack en ligne avec authentification, statistiques et système de tags.

## Stack

- **Frontend** : SvelteKit + TypeScript + TailwindCSS
- **Base de données** : SQLite via Drizzle ORM
- **Auth** : JWT + bcrypt
- **Déploiement** : VPS Ubuntu + nginx + pm2 + GitHub Actions

## Fonctionnalités

- Inscription / Connexion
- Partie de Blackjack avec split
- Bankroll persistante en base de données
- Page profil avec statistiques (parties, victoires, défaites, blackjacks, argent gagné/perdu)
- Modification du pseudo et du mot de passe
- Système de tags débloquables selon les statistiques

## Lancer en local

```sh
npm install
npm run dev
```

## Variables d'environnement

Créer un fichier `.env` à la racine du dossier `blackjack` :

```
JWT_SECRET=votre_secret
```

## Base de données

```sh
npx drizzle-kit push
```

## Build

```sh
npm run build
```

## Déploiement

Le déploiement est automatique à chaque push sur `master` via GitHub Actions.
