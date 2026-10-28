# votre nom

Modèle de site vierge : logos, noms, produits et informations légales sont à remplacer.

- Cherche `[` dans les fichiers pour retrouver tous les champs à remplir (`[nom]`, `[adresse]`, `[email]`...).
- `votre nom` : à remplacer par le nom de votre structure (en-tête, titres des pages, pied de page).
- Logos : `images/logo.webp`, `images/logo-512.png`, `images/apple-touch-icon.png`, `images/favicon-32.png` et `favicon.ico` sont de simples ronds à remplacer.
- Produits : modifie `merch-data.js`.
- Pied de page : modifie `partials/footer.html` puis lance `node maj-footer.js` pour l'appliquer à toutes les pages.

Pour convertir de nouvelles images (ImageMagick ou ffmpeg requis) : mets tes .jpg, .png ou .webp dans `images/originaux/`, lance `convertir-images.sh`, puis récupère les .webp dans `images/`.
