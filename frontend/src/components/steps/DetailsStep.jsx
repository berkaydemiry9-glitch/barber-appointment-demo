import React from "react";

export default function DetailsStep({ customer, setCustomer, onBack, onNext }) {
  return (
    <div className="app-shell fade-in">
      <div className="hero-section">
        <h1 className="h1-brand">Your Information</h1>
        <div className="subtext">Step 4</div>
      </div>

      <div className="services-panel" style={{ maxWidth: 640 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:".9rem" }}>
          {[
            { label:"Full Name", key:"name" },
            { label:"Phone", key:"phone" },
            { label:"Email (optional)", key:"email" },
            { label:"Notes (optional)", key:"notes" }
          ].map(({label,key}) => (
            <div key={key} style={{ display:"flex", flexDirection:"column", gap:".35rem" }}>
              <label style={{ fontSize:".75rem", fontWeight:600, letterSpacing:".6px", textTransform:"uppercase", color:"var(--color-text-light)" }}>{label}</label>
              <input
                style={{ padding:".75rem .9rem", borderRadius:"12px", border:"1px solid var(--color-border)", fontSize:".95rem", background:"#fff", outline:"none" }}
                placeholder={label}
                value={customer[key] || ""}
                onChange={e => setCustomer(c => ({ ...c, [key]: e.target.value }))}
                type="text"
              />
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end", marginTop:"1.2rem" }}>
          <button className="btn btn-secondary" onClick={onBack}>Back</button>
          <button className="btn" disabled={!customer.name || !customer.phone} onClick={onNext}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
