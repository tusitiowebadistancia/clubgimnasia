export const WHATSAPP_NUMBER = "5492262589377";

export const TABLE_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `Mesa ${i + 1}`,
}));

export const menuData = [
  {
    id: "comidas",
    title: "Comidas",
    description: "Pizzas",
    brands: [
      {
        id: "pizzas",
        name: "Pizzas",
        subtitle: "Porción grande",
        items: [
          {
            id: "muzza",
            name: "Muzza",
            size: "Grande",
            price: 14000,
            comment: "Excelente elección, la clásica que nunca falla.",
          },
          {
            id: "cebolla",
            name: "Cebolla",
            size: "Grande",
            price: 15000,
            comment: "Excelente elección, bien sabrosa.",
          },
          {
            id: "jamon",
            name: "Jamón",
            size: "Grande",
            price: 17000,
            comment: "Excelente elección, un favorito del club.",
          },
          {
            id: "jamon-morron",
            name: "Jamón y Morrón / Tomate",
            size: "Grande",
            price: 19000,
            comment: "Excelente elección, bien completa.",
          },
          {
            id: "roquefort",
            name: "Roquefort",
            size: "Grande",
            price: 18000,
            comment: "Excelente elección, con mucho sabor.",
          },
          {
            id: "cantimpalo",
            name: "Cantimpalo",
            size: "Grande",
            price: 18000,
            comment: "Excelente elección, potente y premium.",
          },
        ],
      },
    ],
  },
  {
    id: "sin-alcohol",
    title: "Bebidas sin alcohol",
    description: "Gaseosas, aguas y energéticas",
    brands: [
      {
        id: "pepsi",
        name: "Pepsi",
        items: [
          {
            id: "pepsi-354",
            name: "Pepsi",
            size: "354 ml.",
            price: 3500,
            comment: "Excelente elección, fresca y clásica.",
          },
          {
            id: "pepsi-zero-354",
            name: "Pepsi Zero",
            size: "354 ml.",
            price: 3500,
            comment: "Excelente elección, liviana y fresca.",
          },
          {
            id: "pepsi-500",
            name: "Pepsi",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección para acompañar.",
          },
          {
            id: "pepsi-zero-500",
            name: "Pepsi Zero",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, sin azúcar.",
          },
        ],
      },
      {
        id: "7up",
        name: "7Up",
        items: [
          {
            id: "7up-354",
            name: "7Up",
            size: "354 ml.",
            price: 3500,
            comment: "Excelente elección, bien refrescante.",
          },
          {
            id: "7up-zero-354",
            name: "7Up Zero",
            size: "354 ml.",
            price: 3500,
            comment: "Excelente elección, ligera y fresca.",
          },
        ],
      },
      {
        id: "paso-de-los-toros",
        name: "Paso de los Toros",
        items: [
          {
            id: "tonica-269",
            name: "Tónica",
            size: "269 ml.",
            price: 3500,
            comment: "Excelente elección, elegante y distinta.",
          },
          {
            id: "pomelo-269",
            name: "Pomelo",
            size: "269 ml.",
            price: 3500,
            comment: "Excelente elección, amarga y refrescante.",
          },
          {
            id: "pomelo-500",
            name: "Pomelo",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección para acompañar.",
          },
          {
            id: "zero-500",
            name: "Zero",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, suave y fresca.",
          },
        ],
      },
      {
        id: "speed",
        name: "Speed",
        items: [
          {
            id: "speed-250",
            name: "Speed",
            size: "250 ml.",
            price: 3500,
            comment: "Excelente elección, energía total.",
          },
        ],
      },
      {
        id: "sierra-de-los-padres",
        name: "Sierra de los Padres",
        items: [
          {
            id: "sierra-naranja",
            name: "Naranja",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, frutal y suave.",
          },
          {
            id: "sierra-pomelo",
            name: "Pomelo",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, cítrica y fresca.",
          },
          {
            id: "sierra-manzana",
            name: "Manzana",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, dulce y refrescante.",
          },
        ],
      },
      {
        id: "mirinda",
        name: "Mirinda",
        items: [
          {
            id: "mirinda-500",
            name: "Mirinda",
            size: "500 ml.",
            price: 3500,
            comment: "Excelente elección, sabor clásico.",
          },
        ],
      },
      {
        id: "gatorade",
        name: "Gatorade",
        items: [
          {
            id: "gatorade-manzana",
            name: "Manzana",
            size: "500 ml.",
            price: 4000,
            comment: "Excelente elección, bien deportiva.",
          },
          {
            id: "gatorade-uva",
            name: "Uva",
            size: "500 ml.",
            price: 4000,
            comment: "Excelente elección, intensa y distinta.",
          },
          {
            id: "gatorade-cool-blue",
            name: "Cool Blue",
            size: "500 ml.",
            price: 4000,
            comment: "Excelente elección, una de las más pedidas.",
          },
          {
            id: "gatorade-frutas",
            name: "Frutas Tropicales",
            size: "500 ml.",
            price: 4000,
            comment: "Excelente elección, tropical y fresca.",
          },
        ],
      },
      {
        id: "aguas",
        name: "Aguas",
        items: [
          {
            id: "villavicencio",
            name: "Agua Villavicencio",
            size: "500 ml.",
            price: 3000,
            comment: "Excelente elección, simple y perfecta.",
          },
          {
            id: "cimes",
            name: "Agua Cimes",
            size: "500 ml.",
            price: 3000,
            comment: "Excelente elección, hidratación al instante.",
          },
        ],
      },
    ],
  },
  {
    id: "cervezas",
    title: "Cervezas",
    description: "Ordenadas por marca",
    brands: [
      {
        id: "quilmes",
        name: "Quilmes",
        items: [
          {
            id: "quilmes-1l",
            name: "Quilmes",
            size: "1 litro",
            price: 7000,
            comment: "Excelente elección, una clásica de la casa.",
          },
          {
            id: "quilmes-negra-473",
            name: "Quilmes Negra",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, con más cuerpo.",
          },
          {
            id: "quilmes-sin-473",
            name: "Quilmes sin alcohol",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, todo el sabor sin alcohol.",
          },
        ],
      },
      {
        id: "brahma",
        name: "Brahma",
        items: [
          {
            id: "brahma-1l",
            name: "Brahma",
            size: "1 litro",
            price: 8000,
            comment: "Excelente elección, rendidora para compartir.",
          },
          {
            id: "brahma-354",
            name: "Brahma",
            size: "354 ml.",
            price: 3500,
            comment: "Excelente elección, práctica y fría.",
          },
        ],
      },
      {
        id: "andes",
        name: "Andes",
        items: [
          {
            id: "andes-roja-1l",
            name: "Andes Roja",
            size: "1 litro",
            price: 9000,
            comment: "Excelente elección, de las más buscadas.",
          },
          {
            id: "andes-ipa-1l",
            name: "Andes IPA",
            size: "1 litro",
            price: 9000,
            comment: "Excelente elección, con carácter.",
          },
          {
            id: "andes-roja-473",
            name: "Andes Roja",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, intensa y equilibrada.",
          },
          {
            id: "andes-rubia-473",
            name: "Andes Rubia",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, suave y fresca.",
          },
          {
            id: "andes-ipa-473",
            name: "Andes IPA",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección para cerveceros.",
          },
        ],
      },
      {
        id: "stella",
        name: "Stella Artois",
        items: [
          {
            id: "stella-1l",
            name: "Stella Artois",
            size: "1 litro",
            price: 10000,
            comment: "Excelente elección, más premium.",
          },
          {
            id: "stella-473",
            name: "Stella Artois",
            size: "473 ml.",
            price: 6000,
            comment: "Excelente elección, fina y fría.",
          },
        ],
      },
      {
        id: "baum",
        name: "Baum",
        items: [
          {
            id: "baum-porter-473",
            name: "Baum Porter",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, oscura y cremosa.",
          },
          {
            id: "baum-scottish-473",
            name: "Baum Scottish",
            size: "473 ml.",
            price: 5000,
            comment: "Excelente elección, maltosa y distinta.",
          },
        ],
      },
      {
        id: "otras-marcas",
        name: "Otras marcas",
        items: [
          {
            id: "isenbeck-473",
            name: "Isenbeck",
            size: "473 ml.",
            price: 4500,
            comment: "Excelente elección, económica y rendidora.",
          },
          {
            id: "heineken-473",
            name: "Heineken",
            size: "473 ml.",
            price: 6500,
            comment: "Excelente elección, internacional y premium.",
          },
        ],
      },
    ],
  },
  {
    id: "tragos",
    title: "Tragos",
    description: "Agrupados por estilo",
    brands: [
      {
        id: "aperitivos",
        name: "Aperitivos",
        items: [
          {
            id: "fernet",
            name: "Fernet Branca + Coca-Cola",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, un clásico argentino.",
          },
          {
            id: "gancia",
            name: "Gancia",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, suave y refrescante.",
          },
          {
            id: "cinzano",
            name: "Cinzano",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, bien tradicional.",
          },
          {
            id: "campari",
            name: "Campari",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, amargo y elegante.",
          },
        ],
      },
      {
        id: "gin",
        name: "Gin",
        items: [
          {
            id: "gin-gordons-merle",
            name: "Gin Tonic (Gordons / Merle)",
            size: "Copa",
            price: 7000,
            comment: "Excelente elección, bien perfumado.",
          },
          {
            id: "gin-aconcagua",
            name: "Gin Tonic Aconcagua",
            size: "Copa",
            price: 8000,
            comment: "Excelente elección, premium y equilibrado.",
          },
          {
            id: "gin-bombay",
            name: "Gin Bombay / Beefeater",
            size: "Copa",
            price: 10000,
            comment: "Excelente elección, de alta gama.",
          },
          {
            id: "gin-bosque",
            name: "Gin Bosque Alta Montaña",
            size: "Copa",
            price: null,
            priceLabel: "Consultar",
            comment: "Excelente elección, una opción especial.",
          },
          {
            id: "gin-speed",
            name: "Gin Gordons con Speed",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, intenso y moderno.",
          },
        ],
      },
      {
        id: "whisky",
        name: "Whisky",
        items: [
          {
            id: "medida-jb-red",
            name: "Medida (J&B / Red)",
            size: "Medida",
            price: 8000,
            comment: "Excelente elección, directo y elegante.",
          },
          {
            id: "whisky-blanders",
            name: "Whisky Blanders",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, suave y accesible.",
          },
          {
            id: "whisky-jb",
            name: "Whisky J&B",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, un clásico internacional.",
          },
          {
            id: "red-label",
            name: "J. Walker Red Label",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, con carácter.",
          },
          {
            id: "black-label",
            name: "J. Walker Black Label",
            size: "Vaso",
            price: 10000,
            comment: "Excelente elección, premium de verdad.",
          },
          {
            id: "whiscola",
            name: "Whiscola",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, combinación perfecta.",
          },
          {
            id: "whisky-speed",
            name: "Whisky con Speed",
            size: "Vaso",
            price: 9000,
            comment: "Excelente elección, potente y nocturno.",
          },
        ],
      },
      {
        id: "vodka-y-ron",
        name: "Vodka y Ron",
        items: [
          {
            id: "smirnoff-speed",
            name: "Smirnoff con Speed",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, vibrante y energética.",
          },
          {
            id: "smirnoff-naranja",
            name: "Smirnoff con Naranja",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, cítrico y suave.",
          },
          {
            id: "ron-havana-speed",
            name: "Ron Havana con Speed",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, intenso y distinto.",
          },
          {
            id: "cuba-libre",
            name: "Cuba Libre",
            size: "Vaso",
            price: 7000,
            comment: "Excelente elección, ron con personalidad.",
          },
        ],
      },
      {
        id: "licores",
        name: "Licores",
        items: [
          {
            id: "baileys",
            name: "Baileys",
            size: "Vaso",
            price: 8000,
            comment: "Excelente elección, cremoso y premium.",
          },
        ],
      },
    ],
  },
];

export function formatPrice(value) {
  if (typeof value !== "number") return "Consultar";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export const getTableFromSearch = () => {
  const params = new URLSearchParams(window.location.search);
  const mesa = params.get("mesa");

  return mesa ? mesa : "";
};

export const buildMenuUrlForTable = (table) => {
  const tableNumber = String(table || "").trim();

  return `${window.location.origin}/menu?mesa=${encodeURIComponent(
    tableNumber
  )}`;
};

export function buildWhatsAppMessage(table, cart) {
  const lines = cart.map((item, index) => {
    const subtotal =
      typeof item.price === "number"
        ? formatPrice(item.price * item.quantity)
        : item.priceLabel || "Consultar";

    return `${index + 1}. ${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity} - ${subtotal}`;
  });

  const total = cart.reduce((acc, item) => {
    if (typeof item.price !== "number") return acc;
    return acc + item.price * item.quantity;
  }, 0);

  return [
    `*MESA ${table}*`,
    "",
    "*Pedido:*",
    ...lines,
    "",
    `*Total:* ${formatPrice(total)}`,
  ].join("\n");
}