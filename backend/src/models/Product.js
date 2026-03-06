import mongoose from "mongoose";

const { Schema } = mongoose;

const ratingBreakdownSchema = new Schema(
  {
    one: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    five: { type: Number, default: 0 }
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    verifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const variantSchema = new Schema(
  {
    sku: { type: String, required: true, trim: true },
    attributes: {
      color: { type: String, required: true, trim: true },
      size: { type: String, required: true, trim: true }
    },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const categorySchema = new Schema(
  {
    primary: { type: String, required: true, trim: true },
    secondary: { type: String, trim: true }
  },
  { _id: false }
);

const shippingSchema = new Schema(
  {
    weightInKg: { type: Number, min: 0 },
    dimensionsCm: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: { type: categorySchema, required: true },
    tags: [{ type: String, trim: true }],
    media: {
      thumbnail: { type: String, trim: true },
      gallery: [{ type: String, trim: true }]
    },
    specs: {
      material: { type: String, trim: true },
      warranty: { type: String, trim: true },
      countryOfOrigin: { type: String, trim: true }
    },
    shipping: shippingSchema,
    variants: {
      type: [variantSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one variant is required"
      }
    },
    reviews: [reviewSchema],
    ratingSummary: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      breakdown: { type: ratingBreakdownSchema, default: () => ({}) }
    },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", brand: "text", tags: "text" });
productSchema.index({ "category.primary": 1, "category.secondary": 1 });
productSchema.index({ "variants.sku": 1 }, { unique: true });
productSchema.index({ "ratingSummary.average": -1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual("totalStock").get(function totalStock() {
  return this.variants.reduce((acc, variant) => acc + variant.stock, 0);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.methods.recomputeRatingSummary = function recomputeRatingSummary() {
  const breakdown = { one: 0, two: 0, three: 0, four: 0, five: 0 };

  if (!this.reviews.length) {
    this.ratingSummary = { average: 0, count: 0, breakdown };
    return;
  }

  let sum = 0;
  this.reviews.forEach((review) => {
    sum += review.rating;
    if (review.rating === 1) breakdown.one += 1;
    if (review.rating === 2) breakdown.two += 1;
    if (review.rating === 3) breakdown.three += 1;
    if (review.rating === 4) breakdown.four += 1;
    if (review.rating === 5) breakdown.five += 1;
  });

  this.ratingSummary = {
    average: Number((sum / this.reviews.length).toFixed(2)),
    count: this.reviews.length,
    breakdown
  };
};

productSchema.methods.addReview = async function addReview(reviewInput) {
  this.reviews.push(reviewInput);
  this.recomputeRatingSummary();
  await this.save();
  return this;
};

productSchema.statics.adjustVariantStock = async function adjustVariantStock({
  productId,
  sku,
  quantityDelta
}) {
  if (!quantityDelta || Number.isNaN(quantityDelta)) {
    throw new Error("quantityDelta must be a non-zero number");
  }

  const product = await this.findById(productId);
  if (!product) throw new Error("Product not found");

  const target = product.variants.find((variant) => variant.sku === sku);
  if (!target) throw new Error("Variant SKU not found");

  const nextStock = target.stock + quantityDelta;
  if (nextStock < 0) {
    throw new Error("Insufficient stock for this variant");
  }

  target.stock = nextStock;
  await product.save();
  return product;
};

productSchema.statics.reserveStock = async function reserveStock({ productId, sku, quantity }) {
  return this.adjustVariantStock({
    productId,
    sku,
    quantityDelta: -Math.abs(quantity)
  });
};

productSchema.statics.restockVariant = async function restockVariant({ productId, sku, quantity }) {
  return this.adjustVariantStock({
    productId,
    sku,
    quantityDelta: Math.abs(quantity)
  });
};

export const Product = mongoose.model("Product", productSchema);
