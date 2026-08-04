// Marca link ativo na nav desktop
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === window.location.pathname) {
    link.style.color = 'var(--primary)';
    link.style.fontWeight = '700';
  }
});

// Animação fade-in nos cards ao rolar
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    obs.observe(el);
  });
}
