import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const products = [
  {
    name: "Sunbeam Cotton Kurta",
    slug: "sunbeam-cotton-kurta",
    description: "Breathable festive kurta with modern straight fit.",
    brand: "KANAV",
    category: { primary: "Fashion", secondary: "Ethnic Wear" },
    tags: ["kurta", "festive", "cotton"],
    media: {
      thumbnail: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6",
      gallery: [
        "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6",
        "https://images.unsplash.com/photo-1617957718614-99f6a80f8f81"
      ]
    },
    specs: { material: "Cotton", warranty: "No warranty", countryOfOrigin: "India" },
    shipping: { weightInKg: 0.4, dimensionsCm: { length: 30, width: 20, height: 3 } },
    variants: [
      {
        sku: "KURTA-SUN-M",
        attributes: { color: "Yellow", size: "M" },
        price: 1499,
        salePrice: 1199,
        stock: 8,
        images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"]
      },
      {
        sku: "KURTA-SUN-L",
        attributes: { color: "Orange", size: "L" },
        price: 1499,
        salePrice: 1249,
        stock: 3,
        images: ["https://images.unsplash.com/photo-1617957718614-99f6a80f8f81"]
      }
    ],
    reviews: [
      {
        userName: "Aarav",
        title: "Great fabric",
        comment: "Good stitching and vibrant color.",
        rating: 5,
        verifiedPurchase: true
      },
      {
        userName: "Nisha",
        title: "Nice fit",
        comment: "Comfortable for full-day wear.",
        rating: 4,
        verifiedPurchase: true
      }
    ]
  },
  {
    name: "Citrus Active Sneakers",
    slug: "citrus-active-sneakers",
    description: "Lightweight daily sneakers with flex-foam sole.",
    brand: "KANAV",
    category: { primary: "Footwear", secondary: "Sneakers" },
    tags: ["sports", "daily wear", "foam"],
    media: {
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      gallery: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
      ]
    },
    specs: { material: "Mesh + Rubber", warranty: "6 months", countryOfOrigin: "India" },
    shipping: { weightInKg: 0.8, dimensionsCm: { length: 34, width: 24, height: 12 } },
    variants: [
      {
        sku: "SNKR-CIT-8",
        attributes: { color: "Green", size: "8" },
        price: 2599,
        salePrice: 2199,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"]
      },
      {
        sku: "SNKR-CIT-9",
        attributes: { color: "Orange", size: "9" },
        price: 2599,
        salePrice: 2299,
        stock: 2,
        images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"]
      }
    ],
    reviews: [
      {
        userName: "Kabir",
        title: "Excellent comfort",
        comment: "Very light and comfortable for walking.",
        rating: 5,
        verifiedPurchase: true
      }
    ]
  }
];

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Product.deleteMany({});

  const seeded = [];
  for (const productInput of products) {
    const product = new Product(productInput);
    product.recomputeRatingSummary();
    await product.save();
    seeded.push(product);
  }

  console.log(`Seed completed: ${seeded.length} products inserted.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
