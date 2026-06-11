// ==================== WHATSAPP ====================
function pedir(producto, precio) {
  const numero = "595986179875"; 
  let mensaje = `Hola! Quiero pedir el perfume: ${producto}`;
  if (precio !== undefined) {
    mensaje += ` - Precio: ₲ ${precio}`;
  }
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// ==================== BÚSQUEDA ====================
function setupSearch() {
  const input = document.getElementById('search');
  if (!input) return;
  
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
      const title = (card.querySelector('h3')?.innerText || '').toLowerCase();
      const desc = (card.querySelector('.description')?.innerText || '').toLowerCase();
      const match = q === '' || title.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}

// ==================== MENÚ HAMBURGUESA ====================
function toggleMenu() {
  const btn = document.querySelector('.menu-toggle');
  const menu = document.getElementById('navMenu');
  
  if (btn && menu) {
    btn.classList.toggle('active');
    menu.classList.toggle('active');
  }
}

// Cerrar menú al hacer clic en un enlace
document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
  
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const btn = document.querySelector('.menu-toggle');
      const menu = document.getElementById('navMenu');
      btn?.classList.remove('active');
      menu?.classList.remove('active');
    });
  });
  
  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    const header = document.querySelector('header');
    if (!header.contains(e.target)) {
      const btn = document.querySelector('.menu-toggle');
      const menu = document.getElementById('navMenu');
      btn?.classList.remove('active');
      menu?.classList.remove('active');
    }
  });
});
