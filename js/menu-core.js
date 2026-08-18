// Lógica compartida entre el menú de socios (js/main.js) y el de
// invitados (invitados/js/main.js). Ambos leen la misma planilla y solo
// difieren en qué columna de precio usan — ver loadMenu().

var CATEGORY_ICONS = {
  'entradas': '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20c8 0 13-5 13-13 0-.5 0-1-.06-1.5C11.5 5.5 6 10 6 18c0 .7.05 1.36.14 2"/><path d="M6 20c-1.5-3-1.9-6.2-1-9"/></svg>',
  'parrilla-y-minutas': '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a6 6 0 1 1-12 0c0-1 .23-2.23 1.5-3.5.316.5 1.5 1.5 1.5 3z"/></svg>',
  'pastas': '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12c2 2 4 2 6 0s4-2 6 0 4 2 6 0"/><path d="M4 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0"/><path d="M6 8c1.5-2.5 3-4 6-4s4.5 1.5 6 4"/></svg>',
  'sugerencias-del-chef': '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19h12"/><path d="M7 19V9.5C5.5 9 5 7.6 5 6.5 5 4 7.2 2 10 2c1 0 1.6.4 2 1 .4-.6 1-1 2-1 2.8 0 5 2 5 4.5 0 1.1-.5 2.5-2 3V19"/></svg>',
  'postres': '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-6a8 8 0 0 1 16 0v6"/><path d="M4 21h16"/><path d="M12 3v4"/><path d="M4 15h16"/></svg>'
};
var DEFAULT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/><path d="M9 11v10"/><path d="M17 3c-1.5 0-3 1.5-3 5s1.5 5 3 5v8"/></svg>';

function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseCSV(text) {
  var rows = [];
  var row = [];
  var field = '';
  var inQuotes = false;

  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') { inQuotes = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* ignore, \n closes the row */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else { field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  return rows.filter(function (r) { return r.some(function (cell) { return cell.trim() !== ''; }); });
}

// priceColumn: nombre de la columna de precio a usar (p.ej. 'PRECIO' o
// 'PRECIO INVITADOS'). Si no existe en la planilla, se cae a 'PRECIO' para
// que el sitio no quede en blanco mientras se agrega la columna nueva.
function buildMenuData(rows, priceColumn) {
  if (!rows.length) return [];

  var header = rows[0].map(function (h) { return h.trim().toUpperCase(); });
  var idxCat = header.indexOf('CATEGORIA');
  var idxName = header.indexOf('NOMBRE');
  var idxPrice = header.indexOf(String(priceColumn || 'PRECIO').toUpperCase());
  if (idxPrice === -1) idxPrice = header.indexOf('PRECIO');
  if (idxCat === -1) idxCat = 0;
  if (idxName === -1) idxName = 1;
  if (idxPrice === -1) idxPrice = 2;

  var order = [];
  var byId = {};

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var catName = (r[idxCat] || '').trim();
    var nombre = (r[idxName] || '').trim();
    var precio = (r[idxPrice] || '').trim();
    if (!catName || !nombre) continue;

    var id = slugify(catName);
    if (!byId[id]) {
      byId[id] = { id: id, name: catName, items: [] };
      order.push(id);
    }
    byId[id].items.push({ nombre: nombre, precio: precio });
  }

  return order.map(function (id) { return byId[id]; });
}

function buildSection(category) {
  var section = document.createElement('section');
  section.className = 'section reveal';
  section.id = category.id;

  var head = document.createElement('div');
  head.className = 'section-head';

  var icon = document.createElement('span');
  icon.className = 'section-icon';
  icon.innerHTML = CATEGORY_ICONS[category.id] || DEFAULT_ICON;

  var title = document.createElement('h2');
  title.textContent = category.name;

  var rule = document.createElement('span');
  rule.className = 'rule';

  head.appendChild(icon);
  head.appendChild(title);
  head.appendChild(rule);

  var list = document.createElement('ul');
  list.className = 'items';

  category.items.forEach(function (dish) {
    var li = document.createElement('li');
    li.className = 'item';

    var name = document.createElement('span');
    name.className = 'name';
    name.textContent = dish.nombre;

    var dots = document.createElement('span');
    dots.className = 'dots';

    var price = document.createElement('span');
    price.className = 'price';
    price.textContent = dish.precio;

    li.appendChild(name);
    li.appendChild(dots);
    li.appendChild(price);
    list.appendChild(li);
  });

  section.appendChild(head);
  section.appendChild(list);
  return section;
}

function renderMenu(categories) {
  var nav = document.getElementById('catnav');
  var root = document.getElementById('menu-sections');
  nav.innerHTML = '';
  root.innerHTML = '';

  categories.forEach(function (cat, i) {
    var btn = document.createElement('button');
    btn.dataset.target = cat.id;
    btn.textContent = cat.name;
    if (i === 0) btn.classList.add('active');
    nav.appendChild(btn);

    root.appendChild(buildSection(cat));
  });

  initNav();
  initReveal();
}

function setStatus(message) {
  var el = document.getElementById('menu-status');
  if (!el) return;
  if (!message) {
    el.style.display = 'none';
    return;
  }
  el.textContent = message;
  el.style.display = '';
}

// config: { csvUrl, priceColumn, fallbackMenu }
function loadMenu(config) {
  setStatus('Cargando el menú…');
  fetch(config.csvUrl, { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function (text) {
      var data = buildMenuData(parseCSV(text), config.priceColumn);
      if (!data.length) throw new Error('La planilla no tiene filas válidas');
      renderMenu(data);
      setStatus('');
    })
    .catch(function () {
      renderMenu(config.fallbackMenu);
      setStatus('No pudimos cargar el menú actualizado. Te mostramos la última versión guardada.');
    });
}

// ---------- Navegación por categorías (pestañas + scroll spy) ----------

function initNav() {
  var navWrap = document.querySelector('.catnav-wrap');
  var nav = document.getElementById('catnav');
  var buttons = Array.prototype.slice.call(nav.querySelectorAll('button'));
  var sections = buttons.map(function (b) { return document.getElementById(b.dataset.target); });
  if (!buttons.length) return;

  function navOffset() {
    return navWrap.offsetHeight + 8;
  }

  // Solo mueve la barra horizontal de pestañas, nunca la página — así no
  // compite con el scroll vertical de más abajo y se cancelan entre sí.
  function centerPill(btn) {
    var target = (btn.offsetLeft + btn.offsetWidth / 2) - nav.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }

  function setActive(index) {
    buttons.forEach(function (b, i) { b.classList.toggle('active', i === index); });
    centerPill(buttons[index]);
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      var target = sections[i];
      if (!target) return;
      setActive(i);
      var top = target.getBoundingClientRect().top + window.scrollY - navOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  function currentSectionIndex() {
    var offset = navOffset() + 1;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) return sections.length - 1;

    var index = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - offset <= 0) index = i;
    }
    return index;
  }

  var ticking = false;
  function onScroll() {
    ticking = false;
    var index = currentSectionIndex();
    if (!buttons[index].classList.contains('active')) setActive(index);
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();
}

function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section.reveal').forEach(function (s) { observer.observe(s); });
}
