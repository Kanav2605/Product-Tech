import { useEffect, useMemo, useState } from "react";
import { fetchLowStock, fetchProducts, fetchSummary, fetchTopRated } from "../api/catalogApi";
import ProductCard from "../components/ProductCard";
import StatCard from "../components/StatCard";

function App() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [topRated, setTopRated] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [productsRes, summaryRes, topRes, stockRes] = await Promise.all([
          fetchProducts({ search, category }),
          fetchSummary(),
          fetchTopRated(),
          fetchLowStock()
        ]);

        setProducts(productsRes.items);
        setSummary(summaryRes);
        setTopRated(topRes);
        setLowStock(stockRes);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [search, category]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category.primary))],
    [products]
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="sub">MongoDB + Mongoose Experiment</p>
          <h1>KANAV E-commerce Catalog</h1>
          <p className="hero-copy">
            Nested schemas, variant inventory control, review tracking, and analytics aggregation on one dashboard.
          </p>
        </div>
      </header>

      <section className="toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, brand, tags"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {summary && (
        <section className="stats-grid">
          <StatCard
            title="Total Products"
            value={summary.inventory.totalProducts}
            hint="Documents in catalog"
          />
          <StatCard
            title="Total Variants"
            value={summary.inventory.totalVariants}
            hint="Nested variant entries"
          />
          <StatCard
            title="Total Stock"
            value={summary.inventory.totalStock}
            hint="Available units"
          />
        </section>
      )}

      <section className="panel-layout">
        <div className="product-panel">
          <h2>Catalog</h2>
          {loading && <p>Loading products...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        <aside className="insights-panel">
          <div className="insight-card">
            <h3>Top Rated</h3>
            {topRated.map((item) => (
              <div className="insight-row" key={item._id}>
                <span>{item.name}</span>
                <strong>{item.ratingSummary.average}</strong>
              </div>
            ))}
          </div>
          <div className="insight-card warning">
            <h3>Low Stock Alerts</h3>
            {lowStock.length === 0 && <p>All good right now.</p>}
            {lowStock.map((item) => (
              <div className="insight-row" key={item.sku}>
                <span>{item.sku}</span>
                <strong>{item.stock}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default App;
