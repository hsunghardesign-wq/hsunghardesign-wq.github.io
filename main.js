// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// Scroll-reveal
const targets = document.querySelectorAll(
  '.project-card, .principles__grid > div, .research-grid article, .persona, .scenario, .workstream, .stat, .case-section h2, .contact h2'
);
targets.forEach((el) => el.setAttribute('data-io', ''));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

targets.forEach((el) => io.observe(el));
