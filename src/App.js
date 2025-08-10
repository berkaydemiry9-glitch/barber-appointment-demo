import React, { useState } from "react";
import "./barber-theme.css";
import {
  IconCut,
  IconRazor,
  IconChild,
  IconHotTowel,
  IconLineUp,
  IconFade,
  IconShampoo,
  IconFacial,
  IconCheck
} from "./icons";

// ===== Data =====
const servicesList = [
  { key: "haircut",  name: "Haircut",          duration: 30, icon: IconCut },
  { key: "beard",    name: "Beard Trim",       duration: 20, icon: IconRazor },
  { key: "kids",     name: "Kids Haircut",     duration: 25, icon: IconChild },
  { key: "hotTowel", name: "Hot Towel Shave",  duration: 25, icon: IconHotTowel },
  { key: "lineup",   name: "Line Up",          duration: 15, icon: IconLineUp },
  { key: "fade",     name: "Fade",             duration: 35, icon: IconFade },
  { key: "shampoo",  name: "Shampoo & Style",  duration: 20, icon: IconShampoo },
  { key: "facial",   name: "Facial",           duration: 30, icon: IconFacial }
];

const barbersList = [
  {
    name: "Mike Johnson",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    workingHours: [null,{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"17:00"}],
    appointments: []
  },
  {
    name: "Chris Evans",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    workingHours: [null,{start:"10:00",end:"18:00"},{start:"09:00",end:"18:00"},{start:"10:00",end:"19:00"},{start:"09:30",end:"18:30"},{start:"11:00",end:"19:00"},{start:"09:00",end:"16:00"}],
    appointments: []
  }
];

// ===== Helpers =====
function sumDurations(selectedKeys) {
  return servicesList
    .filter(s => selectedKeys.includes(s.key))
    .reduce((a, b) => a + b.duration, 0);
}

function getNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit"
      }),
        dayIdx: d.getDay()
    };
  });
}

function to12Hour(h, m) {
  const ampm = h >= 12 ? "PM" : "AM";
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getAvailableSlots({ workingHours, appointments, totalDuration, dateStr, slotInterval = 30 }) {
  const d = new Date(dateStr);
  const dayIdx = d.getDay();
  const wh = workingHours[dayIdx];
  if (!wh) return [];
  const slots = [];
  let [h, m] = wh.start.split(":").map(Number);
  const [eh, em] = wh.end.split(":").map(Number);
  const totalSpan = (eh * 60 + em) - (h * 60 + m);
  const steps = Math.floor(totalSpan / slotInterval);
  for (let i = 0; i < steps; i++) {
    const start = (h * 60 + m) + i * slotInterval;
    const end = start + totalDuration;
    if (end > (eh * 60 + em)) break;
    slots.push(to12Hour(Math.floor(start / 60), start % 60));
  }
  return slots;
}

function addMinutes(time, mins) {
  const [t, meridian] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (meridian === "PM" && h !== 12) h += 12;
  if (meridian === "AM" && h === 12) h = 0;
  const d = new Date(2024, 0, 1, h, m + mins);
  let hour = d.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
}

// ===== Main Component =====
export default function App() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // --- STEP 1
  if (step === 1) {
    const total = sumDurations(selectedServices);
    return (
      <div className="app-shell fade-in">
        <div className="hero-section">
          <h1 className="h1-brand">Atlanta Barber Shop</h1>
          <div className="subtext">Select your services</div>
        </div>
        <div className="services-panel fade-in">
          <div className="services-grid">
            {servicesList.map(s => {
              const Icon = s.icon;
              const isSelected = selectedServices.includes(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`service-card ${isSelected ? "selected" : ""}`}
                  onClick={() =>
                    setSelectedServices(prev =>
                      prev.includes(s.key)
                        ? prev.filter(k => k !== s.key)
                        : [...prev, s.key]
                    )
                  }
                  aria-pressed={isSelected}
                >
                  <span className="service-icon"><Icon /></span>
                  <span className="service-name">{s.name}</span>
                  <span className="service-duration">{s.duration} min</span>
                  {isSelected && (
                    <span className="badge-new" aria-label="Selected">
                      <IconCheck style={{ fontSize: "0.6rem" }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="actions-bar">
            <div className="total-duration">
              Total Duration: <strong>{total} min</strong>
            </div>
            <div style={{ display: "flex", gap: ".6rem" }}>
              <button
                className="btn"
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
              >Next</button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedServices([])}
                disabled={selectedServices.length === 0}
              >Clear</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2
  if (step === 2) {
    return (
      <div className="app-shell fade-in">
        <div className="hero-section">
          <h1 className="h1-brand">Choose Your Barber</h1>
          <div className="subtext">Step 2</div>
        </div>
        <div className="services-panel fade-in" style={{ maxWidth: 820 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
            {barbersList.map(b => {
              const active = selectedBarber?.name === b.name;
              return (
                <button
                  key={b.name}
                  onClick={() => { setSelectedBarber(b); setStep(3); }}
                  style={{
                    background: active ? "linear-gradient(120deg,#1e3a8a,#2563eb)" : "#fff",
                    color: active ? "#fff" : "var(--color-text)",
                    border: active ? "1px solid #2563eb" : "1px solid var(--color-border)",
                    borderRadius: "16px",
                    padding: "1rem .9rem",
                    minHeight: 170,
                    display: "flex",
                    flexDirection: "column",
                    gap: ".7rem",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: active ? "0 8px 24px -6px rgba(37,99,235,0.35)" : "var(--shadow-sm)",
                    transition: "var(--transition)"
                  }}
                >
                  <img
                    src={b.img}
                    alt={b.name}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #fff",
                      boxShadow: "0 4px 10px -2px rgba(0,0,0,.25)"
                    }}
                  />
                  <span style={{ fontWeight: 600, letterSpacing: ".4px", fontSize: ".95rem" }}>{b.name}</span>
                  <span style={{ fontSize: ".65rem", letterSpacing: ".7px", fontWeight: 600, opacity: 0.75, textTransform: "uppercase" }}>Mon-Sat</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3
  if (step === 3) {
    const total = sumDurations(selectedServices);
    const days = getNext7Days();
    const slots = date && selectedBarber
      ? getAvailableSlots({
          workingHours: selectedBarber.workingHours,
          appointments: selectedBarber.appointments,
          totalDuration: total,
          dateStr: date
        })
      : [];

    return (
      <div className="app-shell fade-in">
        <div className="hero-section">
          <h1 className="h1-brand">Pick Date & Time</h1>
          <div className="subtext">Step 3</div>
        </div>
        <div className="services-panel" style={{ maxWidth: 880 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: "1.1rem" }}>
            {days.map(d => (
              <button
                key={d.dateStr}
                onClick={() => { setDate(d.dateStr); setSlot(""); }}
                className="btn btn-secondary"
                style={{
                  minWidth: 120,
                  background: date === d.dateStr ? "linear-gradient(90deg,#1e3a8a,#2563eb)" : "#fff",
                  color: date === d.dateStr ? "#fff" : "var(--color-primary)",
                  borderColor: date === d.dateStr ? "transparent" : "var(--color-border)"
                }}
              >{d.label}</button>
            ))}
          </div>

          {date && (
            <>
              <div style={{ fontSize: ".75rem", fontWeight: 600, letterSpacing: ".7px", color: "var(--color-text-light)", textTransform: "uppercase", marginBottom: ".5rem" }}>Available Slots</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".55rem", marginBottom: "1.2rem" }}>
                {slots.length === 0 && <span style={{ fontSize: ".85rem", color: "#9ca3af" }}>No slots for this day</span>}
                {slots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSlot(t)}
                    className="btn btn-secondary"
                    style={{
                      background: slot === t ? "linear-gradient(90deg,#1e3a8a,#2563eb)" : "#fff",
                      color: slot === t ? "#fff" : "var(--color-primary)",
                      padding: ".55rem .85rem",
                      minWidth: "unset"
                    }}
                  >{t} – {addMinutes(t, total)}</button>
                ))}
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
            <button className="btn" disabled={!date || !slot} onClick={() => setStep(4)}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 4
  if (step === 4) {
    return (
      <div className="app-shell fade-in">
        <div className="hero-section">
          <h1 className="h1-brand">Your Information</h1>
          <div className="subtext">Step 4</div>
        </div>
        <div className="services-panel" style={{ maxWidth: 640 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
            {["Full Name", "Phone", "Email (optional)"].map(label => {
              const key = label === "Full Name" ? "name" : label.startsWith("Phone") ? "phone" : "email";
              return (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                  <label style={{ fontSize: ".75rem", fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", color: "var(--color-text-light)" }}>{label}</label>
                  <input
                    style={{ padding: ".75rem .9rem", borderRadius: "12px", border: "1px solid var(--color-border)", fontSize: ".95rem", background: "#fff", outline: "none", transition: "var(--transition)" }}
                    placeholder={label}
                    value={customer[key]}
                    onChange={e => setCustomer(c => ({ ...c, [key]: e.target.value }))}
                    type="text"
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end", marginTop: "1.2rem" }}>
            <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
            <button className="btn" disabled={!customer.name || !customer.phone} onClick={() => setStep(5)}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 5
  return (
    <div className="app-shell fade-in">
      <div className="hero-section">
        <h1 className="h1-brand">Appointment Confirmed</h1>
        <div className="subtext">Thank you!</div>
      </div>
      <div className="services-panel" style={{ maxWidth: 640 }}>
        <div style={{ lineHeight: 1.5, marginBottom: "1.2rem" }}>
          <strong style={{ fontSize: "1rem" }}>Thank you, {customer.name}.</strong>
          <div style={{ fontSize: ".92rem", color: "var(--color-text-light)", marginTop: ".35rem" }}>
            Your booking is confirmed. A reminder can be added later via SMS/email system.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: ".75rem", marginBottom: "1.2rem" }}>
          <DetailCard label="Services" value={servicesList.filter(s => selectedServices.includes(s.key)).map(s => s.name).join(", ")} />
          <DetailCard label="Barber" value={selectedBarber?.name || "-"} />
          <DetailCard label="Date" value={date || "-"} />
          <DetailCard label="Time" value={slot || "-"} />
          <DetailCard label="Phone" value={customer.phone || "-"} />
          <DetailCard label="Email" value={customer.email || "—"} />
        </div>
        <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
          <button
            className="btn"
            onClick={() => {
              setStep(1);
              setSelectedServices([]);
              setSelectedBarber(null);
              setDate("");
              setSlot("");
              setCustomer({ name: "", phone: "", email: "" });
            }}
          >Book Another</button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div style={{
      background: "linear-gradient(180deg,var(--color-surface-alt),#ffffff)",
      border: "1px solid var(--color-border)",
      borderRadius: "14px",
      padding: ".85rem .9rem",
      minHeight: 90,
      display: "flex",
      flexDirection: "column",
      gap: ".4rem",
      boxShadow: "var(--shadow-sm)"
    }}>
      <span style={{
        fontSize: ".65rem",
        fontWeight: 600,
        letterSpacing: ".6px",
        textTransform: "uppercase",
        color: "var(--color-text-light)"
      }}>{label}</span>
      <span style={{
        fontSize: ".85rem",
        fontWeight: 600,
        color: "var(--color-primary)",
        lineHeight: 1.25
      }}>{value || "—"}</span>
    </div>
  );
}
