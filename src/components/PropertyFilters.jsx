const TYPES = ["", "RENT", "SALE"];

export default function PropertyFilters({ filters, onChange, onSubmit, onReset }) {
  return (
    <form className="row g-2 g-md-3 align-items-end" onSubmit={onSubmit}>
      <div className="col-12 col-md-4 col-lg-3">
        <label className="form-label small text-secondary">City</label>
        <input
          name="city"
          className="form-control"
          value={filters.city}
          onChange={onChange}
          placeholder="Mumbai"
        />
      </div>
      <div className="col-6 col-md-4 col-lg-3">
        <label className="form-label small text-secondary">Type</label>
        <select name="type" className="form-select" value={filters.type} onChange={onChange}>
          {TYPES.map((type) => (
            <option key={type || "all"} value={type}>
              {type || "All"}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-md-4 col-lg-4">
        <label className="form-label small text-secondary">Keyword</label>
        <input
          name="keyword"
          className="form-control"
          value={filters.keyword}
          onChange={onChange}
          placeholder="metro, gated community..."
        />
      </div>
      <div className="col-12 col-lg-2 d-flex gap-2">
        <button className="btn btn-primary flex-fill" type="submit">
          Search
        </button>
        <button className="btn btn-outline-secondary" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
