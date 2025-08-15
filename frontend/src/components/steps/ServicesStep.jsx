import React from "react";

export default function ServicesStep({ services, selectedIds, setSelectedIds, onNext }) {
  const toggle = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="app-shell fade-in">
      <div className="hero-section">
        <h1 className="h1-brand">Atlanta Barber Shop</h1>
        <div className="subtext">Select your services</div>
      </div>

      <div className="services-panel">
        <div className="services-grid">
          {services.map(s => {
            const active = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className={`service-card ${active ? "selected" : ""}`}
                aria-pressed={active}
                onClick={() => toggle(s.id)}
              >
                <span className="service-name">{s.name}</span>
                <span className="service-duration">{s.durationMin} min • ${s.price}</span>
                {active && <span className="badge-new" aria-label="Selected">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="actions-bar">
          <div className="total-duration">
            Total:{" "}
            <strong>
              {services.filter(s => selectedIds.includes(s.id)).reduce((a,b)=>a+b.durationMin,0)} min
            </strong>
          </div>
          <button className="btn" disabled={selectedIds.length===0} onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
}
