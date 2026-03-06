import { Product } from "../models/Product.js";

export async function getTopRatedProducts(limit = 5) {
  return Product.aggregate([
    { $match: { isPublished: true } },
    { $match: { "ratingSummary.count": { $gte: 1 } } },
    { $sort: { "ratingSummary.average": -1, "ratingSummary.count": -1 } },
    { $limit: limit },
    {
      $project: {
        name: 1,
        brand: 1,
        category: 1,
        ratingSummary: 1,
        minVariantPrice: { $min: "$variants.price" },
        thumbnail: "$media.thumbnail"
      }
    }
  ]);
}

export async function getPriceStatsByPrimaryCategory() {
  return Product.aggregate([
    { $match: { isPublished: true } },
    { $unwind: "$variants" },
    {
      $group: {
        _id: "$category.primary",
        products: { $addToSet: "$_id" },
        minPrice: { $min: "$variants.price" },
        maxPrice: { $max: "$variants.price" },
        avgPrice: { $avg: "$variants.price" },
        variantsCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        productCount: { $size: "$products" },
        variantsCount: 1,
        minPrice: { $round: ["$minPrice", 2] },
        maxPrice: { $round: ["$maxPrice", 2] },
        avgPrice: { $round: ["$avgPrice", 2] }
      }
    },
    { $sort: { category: 1 } }
  ]);
}

export async function getLowStockVariants(threshold = 5) {
  return Product.aggregate([
    { $match: { isPublished: true } },
    { $unwind: "$variants" },
    { $match: { "variants.stock": { $lte: threshold } } },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$name",
        sku: "$variants.sku",
        stock: "$variants.stock",
        category: "$category.primary",
        color: "$variants.attributes.color",
        size: "$variants.attributes.size"
      }
    },
    { $sort: { stock: 1, productName: 1 } }
  ]);
}

export async function getCatalogSummary() {
  const [summary] = await Product.aggregate([
    {
      $facet: {
        inventory: [
          { $unwind: "$variants" },
          {
            $group: {
              _id: null,
              totalProducts: { $addToSet: "$_id" },
              totalVariants: { $sum: 1 },
              totalStock: { $sum: "$variants.stock" }
            }
          },
          {
            $project: {
              _id: 0,
              totalProducts: { $size: "$totalProducts" },
              totalVariants: 1,
              totalStock: 1
            }
          }
        ],
        categorySplit: [
          {
            $group: {
              _id: "$category.primary",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $project: { _id: 0, category: "$_id", count: 1 } }
        ]
      }
    }
  ]);

  return {
    inventory: summary.inventory[0] ?? { totalProducts: 0, totalVariants: 0, totalStock: 0 },
    categorySplit: summary.categorySplit
  };
}
