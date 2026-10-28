const an = document.getElementById('annee');
if (an) an.textContent = new Date().getFullYear();

const liens = document.querySelectorAll('nav a[href^="#"]');
if (liens.length && 'IntersectionObserver' in window) {
  const sections = [...liens]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entrees) => {
    entrees.forEach(e => {
      if (e.isIntersecting) {
        liens.forEach(a => a.classList.toggle('actif', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}
