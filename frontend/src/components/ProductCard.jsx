function ProductCard({ product }) {
  const lowestPrice = Math.min(...product.variants.map((variant) => variant.salePrice || variant.price));
  const highestPrice = Math.max(...product.variants.map((variant) => variant.price));

  return (
    <article className="product-card">
      <div className="thumb-wrap">
        <img className="thumb" src={product.media.thumbnail} alt={product.name} loading="lazy" />
      </div>
      <div className="card-content">
        <p className="chip">{product.category.primary}</p>
        <h3>{product.name}</h3>
        <p className="desc">{product.description}</p>
        <div className="meta-row">
          <span className="price">Rs {lowestPrice}</span>
          <span className="price-high">MRP Rs {highestPrice}</span>
        </div>
        <div className="rating-row">
          <span>{product.ratingSummary.average || 0} / 5</span>
          <span>{product.ratingSummary.count} reviews</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
