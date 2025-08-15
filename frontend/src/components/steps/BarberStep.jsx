import React from "react";

export default function BarberStep({ barbers, selected, setSelected, onBack, onNext }) {
  return (
    <div className="app-shell fade-in">
      <div className="hero-section">
        <h1 className="h1-brand">Choose Your Barber</h1>
        <div className="subtext">Step 2</div>
      </div>

      <div className="services-panel" style={{ maxWidth: 820 }}>
        <div className="barbers-grid">
          {barbers.map(b => {
            const active = selected?.id === b.id;
            return (
              <button
                key={b.id}
                className={`barber-card ${active ? "selected" : ""}`}
                onClick={() => setSelected(b)}
              >
                <img src={b.img} alt={b.name} className="barber-avatar" />
                <span className="barber-name">{b.name}</span>
                <span className="barber-meta">Mon–Sat</span>
              </button>
            );
          })}
        </div>

        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end" }}>
          <button className="btn btn-secondary" onClick={onBack}>Back</button>
          <button className="btn" onClick={onNext} disabled={!selected}>Next</button>
        </div>
      </div>
    </div>
  );
}
