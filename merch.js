const REDUIT = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ANIME = document.body.dataset.anim === 'oui';
// Sur l'accueil, la section Merch est tout en bas : ses images peuvent attendre.
// Sur /merch, les cartes sont en haut de page : on les charge tout de suite.
const SOUS_LE_PLI = !!document.querySelector('#merch #liste-groupes');

function creerCarte({ href, couleur, visuel, image, classeArt, titre, ligne1, ligne2, prix, index }) {
  const el = document.createElement(href ? 'a' : 'article');
  el.className = 'band';
  if (href) {
    el.href = href;
    el.dataset.couleur = couleur;
    el.addEventListener('click', (e) => ouvrirAvecAnimation(el, e));
  }
  if (ANIME && !REDUIT) {
    el.classList.add('entree');
    el.style.setProperty('--i', index + 3);
  }

  const art = document.createElement('div');
  art.className = 'art ' + couleur + (classeArt ? ' ' + classeArt : '');
  if (image) {
    const img = document.createElement('img');
    img.src = image.replace(/^\//, ''); // "/images/x.webp" ou "images/x.webp" : les deux marchent
    img.alt = visuel;
    img.width = 500;
    img.height = 500;
    img.decoding = 'async';
    if (SOUS_LE_PLI) img.loading = 'lazy';
    art.appendChild(img);
  } else {
    art.setAttribute('aria-hidden', 'true');
    art.textContent = visuel;
  }

  const txt = document.createElement('div');
  txt.className = 'txt';

  const h3 = document.createElement('h3');
  h3.textContent = titre;
  txt.appendChild(h3);

  [ligne1, ligne2].forEach((t) => {
    if (!t) return;
    const p = document.createElement('p');
    p.textContent = t;
    txt.appendChild(p);
  });

  if (prix) {
    const d = document.createElement('div');
    d.className = 'price';
    d.textContent = prix;
    txt.appendChild(d);
  }

  el.append(art, txt);
  return el;
}

function ouvrirAvecAnimation(carte, e) {
  if (REDUIT || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();

  const r = carte.getBoundingClientRect();
  const voile = document.createElement('div');
  voile.className = 'voile ' + carte.dataset.couleur;
  document.body.appendChild(voile);

  const debut = { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '20px' };
  const fin = { top: '0px', left: '0px', width: document.documentElement.clientWidth + 'px', height: window.innerHeight + 'px', borderRadius: '0px' };
  Object.assign(voile.style, debut);

  try { sessionStorage.setItem('voile', carte.dataset.couleur); } catch (_) {}

  let parti = false;
  const aller = () => { if (!parti) { parti = true; location.href = carte.href; } };
  voile.animate([debut, fin], { duration: 550, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' })
    .finished.then(aller, aller);
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) document.querySelectorAll('.voile').forEach((v) => v.remove());
});

const listeGroupes = document.getElementById('liste-groupes');
if (listeGroupes) {
  GROUPES.forEach((g, i) => {
    const n = g.merch.length;
    listeGroupes.appendChild(creerCarte({
      href: 'groupe-merch.html?g=' + encodeURIComponent(g.id),
      couleur: g.couleur,
      visuel: g.nom,
      image: g.image,
      classeArt: g.image ? '' : 'art-nom',
      titre: 'Voir le merch',
      ligne1: n === 0 ? 'Bientôt disponible' : n + (n > 1 ? ' articles' : ' article'),
      index: i
    }));
  });
}

const listeMerch = document.getElementById('liste-merch');
if (listeMerch) {
  const id = new URLSearchParams(location.search).get('g');
  const groupe = GROUPES.find((g) => g.id === id);

  if (!groupe) {
    document.getElementById('nom-groupe').textContent = 'Page introuvable';
    document.getElementById('desc-groupe').textContent = "Cette page n'existe pas. Retourne au merch pour en choisir une.";
  } else {
    document.title = 'Merch ' + groupe.nom + ' – votre nom';
    document.getElementById('nom-groupe').textContent = groupe.nom;
    document.getElementById('desc-groupe').textContent = groupe.description;
    if (groupe.merch.length === 0) {
      const vide = document.createElement('p');
      vide.className = 'vide';
      vide.textContent = 'Aucun article pour le moment, bientôt disponible.';
      listeMerch.after(vide);
    }
    groupe.merch.forEach((a, i) => {
      listeMerch.appendChild(creerCarte({
        couleur: groupe.couleur,
        visuel: a.visuel,
        image: a.image,
        titre: a.nom,
        ligne1: a.description,
        prix: a.prix,
        index: i
      }));
    });
  }
}

