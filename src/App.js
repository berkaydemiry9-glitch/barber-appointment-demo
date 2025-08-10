import React, { useState } from "react";
import "./barber-theme.css";

// Berber Hizmetleri
const servicesList = [
  { name: "Saç Kesimi", icon: "✂️", duration: 30 },
  { name: "Sakal Tıraşı", icon: "🪒", duration: 20 },
  { name: "Çocuk Saç Kesimi", icon: "🧒", duration: 25 },
  { name: "Sakal Şekillendirme", icon: "🧔", duration: 15 },
  { name: "Yıkama & Fön", icon: "💦", duration: 15 },
];

// Dummy Barber List
const barbersList = [
  {
    name: "Mustafa Usta",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    workingHours: [
      null, // Pazar
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "10:00", end: "17:00" },
    ],
    appointments: [],
  },
  {
    name: "Ali",
    img: "https://randomuser.me/api/portraits/men/58.jpg",
    workingHours: [
      null,
      { start: "10:00", end: "18:00" },
      { start: "09:00", end: "17:30" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "18:00" },
      { start: "11:00", end: "19:30" },
      { start: "10:00", end: "17:00" },
    ],
    appointments: [],
  },
];

// Helpers
function sumDurations(selectedNames) {
  return servicesList
    .filter((s) => selectedNames.includes(s.name))
    .reduce((a, b) => a + b.duration, 0);
}

function getNext7Days() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dateStr: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("tr-TR", { weekday: "short", day: "2-digit", month: "short" }),
      dayIdx: d.getDay(),
    };
  });
}

// Demo slot (her 30 dakikada bir slot)
function getAvailableSlots({ workingHours, appointments, totalDuration, dateStr, slotInterval = 30 }) {
  const d = new Date(dateStr);
  const dayIdx = d.getDay();
  const wh = workingHours[dayIdx];
  if (!wh) return [];
  const slots = [];
  let [h, m] = wh.start.split(":").map(Number);
  const [eh, em] = wh.end.split(":").map(Number);
  const totalSlots = ((eh * 60 + em) - (h * 60 + m)) / slotInterval;
  for (let i = 0; i < totalSlots; i++) {
    const slotStart = (h * 60 + m) + i * slotInterval;
    const slotEnd = slotStart + totalDuration;
    if (slotEnd > (eh * 60 + em)) break;
    // dummy: çakışma kontrolü yok (sadece demo)
    slots.push(
      `${String(Math.floor(slotStart / 60)).padStart(2, "0")}:${String(slotStart % 60).padStart(2, "0")}`
    );
  }
  return slots;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2025, 0, 1, h, m + mins);
  return d.toTimeString().slice(0, 5);
}

export default function App() {
  // State'ler
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // 1. Adım: Hizmet Seçimi
  if (step === 1) {
    const total = sumDurations(selectedServices);
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="barber-header">
          <span className="barber-pole" />
          Super Barber
        </div>
        <div className="barber-card" style={{ maxWidth: 600 }}>
          <h2 style={{ textAlign: "center", color: "#b93434", marginBottom: "1.2rem" }}>Hizmet Seçimi</h2>
          <div className="barber-services">
            {servicesList.map((s) => (
              <div
                key={s.name}
                className={`barber-service${selectedServices.includes(s.name) ? " selected" : ""}`}
                onClick={() =>
                  setSelectedServices((prev) =>
                    prev.includes(s.name)
                      ? prev.filter((x) => x !== s.name)
                      : [...prev, s.name]
                  )
                }
              >
                <span style={{ fontSize: "1.7em" }}>{s.icon}</span>
                <span>{s.name}</span>
                <span style={{ fontSize: "0.9em", color: "#b93434", fontWeight: 400 }}>{s.duration} dk</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right", color: "#b93434", marginTop: 10 }}>
            <b>Toplam Süre:</b> {total} dk
          </div>
          <button
            className="barber-btn"
            style={{ width: "100%", marginTop: 24 }}
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
          >
            Devam Et
          </button>
        </div>
      </div>
    );
  }

  // 2. Adım: Berber Seçimi
  if (step === 2) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="barber-header">
          <span className="barber-pole" />
          Super Barber
        </div>
        <div className="barber-card" style={{ maxWidth: 600 }}>
          <h2 style={{ textAlign: "center", color: "#b93434", marginBottom: 24 }}>Berber Seçimi</h2>
          <div style={{ display: "flex", gap: 30, justifyContent: "center", marginBottom: 30 }}>
            {barbersList.map((b) => (
              <button
                key={b.name}
                onClick={() => { setSelectedBarber(b); setStep(3); }}
                style={{
                  border: selectedBarber?.name === b.name ? "2.5px solid #f6c453" : "2px solid #b93434",
                  background: selectedBarber?.name === b.name ? "#b93434" : "#fff6ec",
                  color: selectedBarber?.name === b.name ? "#fff" : "#1a2233",
                  borderRadius: 16,
                  padding: 18,
                  boxShadow: "0 1px 8px #1a223344",
                  cursor: "pointer",
                  minWidth: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 500,
                  fontSize: "1.12em"
                }}
              >
                <img src={b.img} alt={b.name} style={{ width: 54, height: 54, borderRadius: "50%", border: "2.5px solid #f6c453", marginBottom: 4 }} />
                {b.name}
              </button>
            ))}
          </div>
          <button className="barber-btn" style={{ width: "100%" }} onClick={() => setStep(1)}>
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // 3. Adım: Tarih & Saat
  if (step === 3) {
    const total = sumDurations(selectedServices);
    const days = getNext7Days();
    const availableSlots = date && selectedBarber
      ? getAvailableSlots({
        workingHours: selectedBarber.workingHours,
        appointments: selectedBarber.appointments,
        totalDuration: total,
        dateStr: date,
        slotInterval: 30
      })
      : [];
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="barber-header">
          <span className="barber-pole" />
          Super Barber
        </div>
        <div className="barber-card" style={{ maxWidth: 600 }}>
          <h2 style={{ textAlign: "center", color: "#b93434", marginBottom: 20 }}>Tarih & Saat Seçimi</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, justifyContent: "center" }}>
            {days.map(d => (
              <button
                key={d.dateStr}
                onClick={() => { setDate(d.dateStr); setSlot(""); }}
                className="barber-btn"
                style={{
                  background: date === d.dateStr ? "#b93434" : "#fff",
                  color: date === d.dateStr ? "#fff" : "#b93434",
                  border: "1.5px solid #b93434",
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "0.6em 1em"
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          {date && (
            <div>
              <div style={{ color: "#b93434", fontWeight: 600, marginBottom: 7, textAlign: "center" }}>Uygun Saatler:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 18 }}>
                {availableSlots.length === 0 && (
                  <span style={{ color: "#888" }}>Uygun saat yok</span>
                )}
                {availableSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSlot(t)}
                    className="barber-btn"
                    style={{
                      background: slot === t ? "#f6c453" : "#fff",
                      color: slot === t ? "#b93434" : "#b93434",
                      border: "1.5px solid #b93434",
                      fontWeight: 600,
                      fontSize: 15,
                      padding: "0.5em 1em"
                    }}
                  >
                    {t} - {addMinutes(t, total)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="barber-btn" style={{ flex: 1 }} onClick={() => setStep(2)}>
              Geri Dön
            </button>
            <button
              className="barber-btn"
              style={{ flex: 1, background: !date || !slot ? "#b9343488" : "" }}
              disabled={!date || !slot}
              onClick={() => setStep(4)}
            >
              Devam Et
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Adım: Bilgiler
  if (step === 4) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="barber-header">
          <span className="barber-pole" />
          Super Barber
        </div>
        <div className="barber-card" style={{ maxWidth: 600 }}>
          <h2 style={{ textAlign: "center", color: "#b93434", marginBottom: 20 }}>Bilgileriniz</h2>
          <input
            placeholder="Ad Soyad"
            value={customer.name}
            onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
            required
          />
          <input
            placeholder="Telefon"
            value={customer.phone}
            onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            required
          />
          <input
            placeholder="E-mail (opsiyonel)"
            value={customer.email}
            onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="barber-btn" style={{ flex: 1 }} onClick={() => setStep(3)}>
              Geri Dön
            </button>
            <button
              className="barber-btn"
              style={{ flex: 1, background: !customer.name || !customer.phone ? "#b9343488" : "" }}
              disabled={!customer.name || !customer.phone}
              onClick={() => setStep(5)}
            >
              Randevuyu Tamamla
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Adım: Başarı
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="barber-header">
        <span className="barber-pole" />
        Super Barber
      </div>
      <div className="barber-card" style={{ maxWidth: 600, textAlign: "center" }}>
        <h2 style={{ color: "#b93434", marginBottom: 18 }}>Randevunuz Alındı!</h2>
        <p style={{ color: "#1a2233", fontSize: "1.1em" }}>
          Teşekkürler <b>{customer.name}</b>!<br />
          Randevunuz başarıyla oluşturuldu.
        </p>
        <div style={{ textAlign: "left", margin: "1.2em 0", color: "#b93434" }}>
          <b>Seçilen Hizmetler:</b> {selectedServices.join(", ")}<br />
          <b>Berber:</b> {selectedBarber?.name}<br />
          <b>Tarih/Saat:</b> {date} {slot}<br />
          <b>Telefon:</b> {customer.phone}
        </div>
        <button
          className="barber-btn"
          style={{ width: "100%" }}
          onClick={() => {
            setStep(1);
            setSelectedServices([]);
            setSelectedBarber(null);
            setDate("");
            setSlot("");
            setCustomer({ name: "", phone: "", email: "" });
          }}
        >
          Yeni Randevu Al
        </button>
      </div>
    </div>
  );
}
