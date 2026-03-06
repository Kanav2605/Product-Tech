function StatCard({ title, value, hint }) {
  return (
    <article className="stat-card">
      <p className="stat-title">{title}</p>
      <h3>{value}</h3>
      <p className="stat-hint">{hint}</p>
    </article>
  );
}

export default StatCard;
