
# JOBZIO — Proxy France Travail (CORS activé)

## Déploiement via Render (méthode simple)
1) Crée un repo GitHub vide et ajoute ces fichiers: server.js, package.json, .env.example (facultatif: render.yaml)
2) Sur Render.com: New -> Web Service -> Connect ce repo
3) Node 18+, Build: `npm install`, Start: `npm start`
4) Vars env: CLIENT_ID, CLIENT_SECRET (Emploi-Store), (optionnels AUTH_URL, API_BASE, SCOPE)
5) Tester:
   - /health
   - /api/offres/search?motsCles=cuisinier&departement=13&range=0-24

## Déploiement via Render Blueprint (optionnel)
- Ajoute `render.yaml` à la racine du repo et choisis "Blueprint".
