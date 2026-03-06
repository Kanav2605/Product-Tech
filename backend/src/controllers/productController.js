import { Product } from "../models/Product.js";
import {
  getCatalogSummary,
  getLowStockVariants,
  getPriceStatsByPrimaryCategory,
  getTopRatedProducts
} from "../services/catalogAggregation.js";

function buildListQuery({ search, category, minPrice, maxPrice }) {
  const query = { isPublished: true };

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    query["category.primary"] = category;
  }

  if (minPrice || maxPrice) {
    query.variants = {
      $elemMatch: {
        ...(minPrice ? { price: { $gte: Number(minPrice) } } : {}),
        ...(maxPrice ? { price: { $lte: Number(maxPrice) } } : {})
      }
    };
  }

  return query;
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Math.min(Math.max(Number(limit), 1), 50);

    const query = buildListQuery({ search, category, minPrice, maxPrice });

    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      Product.countDocuments(query)
    ]);

    return res.json({
      items,
      meta: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

export async function addReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.addReview(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

export async function reserveStock(req, res, next) {
  try {
    const { sku, quantity } = req.body;
    const product = await Product.reserveStock({
      productId: req.params.id,
      sku,
      quantity: Number(quantity)
    });

    return res.json({ message: "Stock reserved", product });
  } catch (error) {
    return next(error);
  }
}

export async function restockVariant(req, res, next) {
  try {
    const { sku, quantity } = req.body;
    const product = await Product.restockVariant({
      productId: req.params.id,
      sku,
      quantity: Number(quantity)
    });

    return res.json({ message: "Stock updated", product });
  } catch (error) {
    return next(error);
  }
}

export async function topRated(req, res, next) {
  try {
    const data = await getTopRatedProducts(Number(req.query.limit) || 5);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function priceStats(req, res, next) {
  try {
    const data = await getPriceStatsByPrimaryCategory();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function lowStock(req, res, next) {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const data = await getLowStockVariants(threshold);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function catalogSummary(req, res, next) {
  try {
    const data = await getCatalogSummary();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}
