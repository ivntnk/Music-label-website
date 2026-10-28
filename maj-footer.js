#!/usr/bin/env node
// Applique partials/footer.html à TOUTES les pages .html du site.
// Usage : node maj-footer.js
// Pour changer le footer partout : modifie partials/footer.html puis relance cette commande.
const fs = require('fs');
const path = require('path');

const DEBUT = '<!-- footer:debut (généré depuis partials/footer.html — ne pas modifier ici, voir maj-footer.js) -->';
const FIN = '<!-- footer:fin -->';

const footer = fs.readFileSync(path.join(__dirname, 'partials', 'footer.html'), 'utf8').trim();
const bloc = DEBUT + '\n' + footer + '\n' + FIN;

const pages = fs.readdirSync(__dirname).filter((f) => f.endsWith('.html'));
let modifiees = 0;

for (const page of pages) {
  const chemin = path.join(__dirname, page);
  const avant = fs.readFileSync(chemin, 'utf8');
  let apres;

  const reBloc = /<!-- footer:debut[^>]*-->[\s\S]*?<!-- footer:fin -->/;
  const reFooter = /<footer[\s\S]*?<\/footer>/;
  if (reBloc.test(avant)) {
    apres = avant.replace(reBloc, () => bloc);
  } else if (reFooter.test(avant)) {
    apres = avant.replace(reFooter, () => bloc);
  } else if (/<\/main>/.test(avant)) {
    apres = avant.replace(/<\/main>/, () => '</main>\n\n' + bloc);
  } else {
    console.error('!  ' + page + ' : ni <footer> ni </main> trouvé, ignorée');
    continue;
  }

  // le footer affiche l'année via script.js
  if (!/<script[^>]+script\.js/.test(apres)) {
    apres = apres.replace(/<\/body>/, '<script src="script.js" defer></script>\n</body>');
  }

  if (apres !== avant) {
    fs.writeFileSync(chemin, apres);
    modifiees++;
    console.log('OK  ' + page);
  } else {
    console.log('=   ' + page + ' (déjà à jour)');
  }
}
console.log('Terminé : ' + modifiees + ' page(s) mise(s) à jour sur ' + pages.length + '.');
