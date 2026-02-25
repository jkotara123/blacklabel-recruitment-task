import fs from "fs";
import path from "path";

const COUNTRIES = {
  Poland: {
    code: "PL",
    baseDelivery: 2,
    cities: [
      { name: "Warsaw", lat: 52.2297, lon: 21.0122 },
      { name: "Krakow", lat: 50.0647, lon: 19.945 },
      { name: "Wroclaw", lat: 51.1079, lon: 17.0385 },
    ],
  },
  Germany: {
    code: "DE",
    baseDelivery: 3,
    cities: [
      { name: "Berlin", lat: 52.52, lon: 13.405 },
      { name: "Munich", lat: 48.1351, lon: 11.582 },
      { name: "Hamburg", lat: 53.5511, lon: 9.9937 },
    ],
  },
  France: {
    code: "FR",
    baseDelivery: 5,
    cities: [
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Lyon", lat: 45.764, lon: 4.8357 },
      { name: "Marseille", lat: 43.2965, lon: 5.3698 },
    ],
  },
  Spain: {
    code: "ES",
    baseDelivery: 8,
    cities: [
      { name: "Madrid", lat: 40.4168, lon: -3.7038 },
      { name: "Barcelona", lat: 41.3851, lon: 2.1734 },
    ],
  },
  UK: {
    code: "GB",
    baseDelivery: 4,
    cities: [
      { name: "London", lat: 51.5074, lon: -0.1278 },
      { name: "Manchester", lat: 53.4808, lon: -2.2426 },
    ],
  },
  "Czech Republic": {
    code: "CZ",
    baseDelivery: 2,
    cities: [
      { name: "Prague", lat: 50.0755, lon: 14.4378 },
      { name: "Brno", lat: 49.1951, lon: 16.6068 },
    ],
  },
  Italy: {
    code: "IT",
    baseDelivery: 7,
    cities: [
      { name: "Rome", lat: 41.9028, lon: 12.4964 },
      { name: "Milan", lat: 45.4642, lon: 9.19 },
      { name: "Naples", lat: 40.8518, lon: 14.2681 },
    ],
  },
  Hungary: {
    code: "HU",
    baseDelivery: 3,
    cities: [
      { name: "Budapest", lat: 47.4979, lon: 19.0402 },
      { name: "Debrecen", lat: 47.5316, lon: 21.6273 },
    ],
  },
};

const CATEGORIES = {
  Electronics: {
    subs: ["Smartphones", "Laptops", "Audio", "Accessories"],
    minP: 50,
    maxP: 5000,
  },
  "Home & Garden": {
    subs: ["Furniture", "Tools", "Decor"],
    minP: 20,
    maxP: 1500,
  },
  Fashion: { subs: ["Clothing", "Shoes", "Watches"], minP: 15, maxP: 800 },
};

const CUSTOMER_TYPES = ["new", "returning"];
const DEVICES = ["Mobile", "Desktop", "Tablet"];
const METHODS = ["Credit Card", "PayPal", "Bank Transfer", "Apple Pay"];

function generateData(count = 1000) {
  const orders = [];
  const now = new Date();
  const oneYearAgo = new Date().setFullYear(now.getFullYear() - 1);
  for (let i = 0; i < count; i++) {
    const countryNames = Object.keys(COUNTRIES);
    const countryName =
      countryNames[Math.floor(Math.random() * countryNames.length)];
    const countryData = COUNTRIES[countryName];
    const city =
      countryData.cities[Math.floor(Math.random() * countryData.cities.length)];

    const catNames = Object.keys(CATEGORIES);
    const catName = catNames[Math.floor(Math.random() * catNames.length)];
    const categoryData = CATEGORIES[catName];
    const subcategory =
      categoryData.subs[Math.floor(Math.random() * categoryData.subs.length)];

    const unitPrice = parseFloat(
      (
        Math.random() * (categoryData.maxP - categoryData.minP) +
        categoryData.minP
      ).toFixed(2),
    );
    const quantity = Math.floor(Math.random() * 3) + 1;

    const timestamp = new Date(oneYearAgo + Math.random() * (now - oneYearAgo));
    const deliveryDays = Math.max(
      1,
      countryData.baseDelivery + Math.floor(Math.random() * 5) - 1,
    );

    const FOURTEEN_DAYS = 30 * 24 * 60 * 60 * 1000;
    const customerType =
      timestamp.getMonth() == 11
        ? "new"
        : timestamp - oneYearAgo < FOURTEEN_DAYS
          ? "new"
          : quantity === 3
            ? "returning"
            : CUSTOMER_TYPES[Math.floor(Math.random() * CUSTOMER_TYPES.length)];

    orders.push({
      orderId: `ORD-${10000 + i}`,
      timestamp: timestamp.toISOString(),
      country: countryName,
      city: city.name,
      lat: city.lat,
      lon: city.lon,
      category: catName,
      subcategory,
      product: `${subcategory} Pro ${i % 10}`,
      quantity,
      unitPrice,
      paymentMethod: METHODS[Math.floor(Math.random() * METHODS.length)],
      customerType,
      device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
      deliveryDays,
    });
  }
  orders.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const finalData = {
    meta: {
      currency: "PLN",
      generatedAt: new Date().toISOString(),
      source: "Generator Script",
    },
    orders,
  };
  const dir = "./public/data";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, "generated-data.json"),
    JSON.stringify(finalData, null, 2),
  );
  console.log(`Wygenerowano ${count} zamówień w public/data/orders.json`);
}

generateData(1500);
