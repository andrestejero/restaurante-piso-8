// El contenido del menú vive en la misma planilla de Google Sheets que el
// menú de socios, pero esta versión lee la columna PRECIO INVITADOS en vez
// de PRECIO. La lógica de carga/render es compartida — ver ../js/menu-core.js.
var MENU_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4Oz3X1dRFlF-7Tj5RXA6HCCrf1a6qCZfMTzcEBS7u4orzlO-fYYVETwECddN1nb_EyjjLHqJJfXdl/pub?output=csv';

// Se usa solo si la planilla no responde (sin conexión, Google caído, etc.),
// para que el sitio nunca quede en blanco. Actualizar estos precios a mano
// si los valores de invitados difieren de los de socios.
var FALLBACK_MENU = [
  { id: 'entradas', name: 'Entradas', items: [
    { nombre: 'Ensalada Capresse c/jamón crudo', precio: '$ 9.200' },
    { nombre: 'Vitel Toné', precio: '$ 7.500' },
    { nombre: 'Empanada de carne (1)', precio: '$ 3.400' },
    { nombre: 'Tortilla individual de papa', precio: '$ 5.300' },
    { nombre: 'Bastones de mozzarella c/salsa fileto', precio: '$ 7.000' },
    { nombre: 'Omelette mixto', precio: '$ 8.600' },
    { nombre: 'Rabas (porción)', precio: '$ 11.300' }
  ]},
  { id: 'parrilla-y-minutas', name: 'Parrilla y Minutas', items: [
    { nombre: 'Bife de Chorizo', precio: '$ 28.500' },
    { nombre: 'Pollo Grillé', precio: '$ 8.600' },
    { nombre: 'Milanesa de Ternera c/guarnición', precio: '$ 12.600' },
    { nombre: 'Milanesa Napolitana', precio: '$ 15.700' },
    { nombre: 'Milanesa de Pollo c/guarnición', precio: '$ 12.200' },
    { nombre: 'Milanesa de Pollo Napolitana', precio: '$ 15.000' },
    { nombre: 'Pollo relleno c/guarnición', precio: '$ 16.500' },
    { nombre: 'Pollo Bonne Femme', precio: '$ 16.500' }
  ]},
  { id: 'pastas', name: 'Pastas', items: [
    { nombre: 'Raviolones de Osobuco al Malbec', precio: '$ 20.200' },
    { nombre: 'Raviolones de Calabaza y Parmesano', precio: '$ 15.800' },
    { nombre: 'Ñoquis', precio: '$ 7.500' },
    { nombre: 'Sorrentinos de Jamón y Nuez', precio: '$ 15.800' }
  ]},
  { id: 'sugerencias-del-chef', name: 'Sugerencias del Chef', items: [
    { nombre: 'Bondiola a la cerveza negra', precio: '$ 17.800' },
    { nombre: 'Matambre a la pizza', precio: '$ 17.600' },
    { nombre: 'Trucha Maître d\'Hotel', precio: '$ 22.400' },
    { nombre: 'Merluza a la Romana', precio: '$ 13.400' },
    { nombre: 'Merluza a la Griega', precio: '$ 12.300' },
    { nombre: 'Ensalada Azul', precio: '$ 10.000' },
    { nombre: 'Ojo de Bife c/guarnición', precio: '$ 31.000' },
    { nombre: 'Raviolones de Salmón con tinta negra', precio: '$ 20.200' }
  ]},
  { id: 'postres', name: 'Postres', items: [
    { nombre: 'Flan Casero c/salsa de caramelo', precio: '$ 5.600' },
    { nombre: 'Helado', precio: '$ 5.900' },
    { nombre: 'Macedonia de Frutas', precio: '$ 5.600' },
    { nombre: 'Budín de Pan c/salsa de caramelo', precio: '$ 5.600' },
    { nombre: 'Bombón Escocés', precio: '$ 5.600' },
    { nombre: 'Lemon Pie', precio: '$ 6.800' },
    { nombre: 'Crumble de manzana c/helado', precio: '$ 7.400' },
    { nombre: 'Cheesecake c/frutos rojos', precio: '$ 7.400' },
    { nombre: 'Brownie c/helado y salsa de frutos rojos', precio: '$ 7.400' },
    { nombre: 'Porción de crema o dulce de leche', precio: '$ 1.200' }
  ]}
];

loadMenu({ csvUrl: MENU_CSV_URL, priceColumn: 'PRECIO INVITADOS', fallbackMenu: FALLBACK_MENU });
