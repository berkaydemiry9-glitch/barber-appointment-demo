import React, { useState } from "react";
import "./index.css";

const servicesList = [
  { name: "Saç Kesimi", icon: "💇‍♂️" },
  { name: "Sakal Düzeltme", icon: "🧔" },
  { name: "Çocuk Saç Kesimi", icon: "🧒" },
  { name: "Tıraş", icon: "🪒" },
  { name: "Saç & Sakal", icon: "💇‍♂️🧔" },
  { name: "Şekillendirme", icon: "✂️" },
  { name: "Sıcak Havlu", icon: "🧖‍♂️" },
  { name: "Saç Yıkama", icon: "🚿" }
];

const barbersList = [
  { name: "Mike Johnson", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Alex Smith", img: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Uygun Berber", img: "https://randomuser.me/api/portraits/lego/3.jpg" }
];

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [payment, setPayment] = useState("");

  // Card Wrapper
  const Card = ({ children }) => (
    <div className="max-w-md w-full mx-auto mt-10 bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
      {children}
    </div>
  );

  // Step 1: Services
  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Adım 1: Hizmet Seçin</p>
        <Card>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {servicesList.map((s) => (
              <button
                key={s.name}
                onClick={() =>
                  setSelectedServices((prev) =>
                    prev.includes(s.name)
                      ? prev.filter((x) => x !== s.name)
                      : [...prev, s.name]
                  )
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition
                  ${selectedServices.includes(s.name)
                    ? "bg-primary text-white shadow"
                    : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
                type="button"
              >
                <span className="text-2xl">{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
          <button
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-accent text-primary font-semibold text-lg shadow transition hover:bg-primary hover:text-white disabled:opacity-40"
          >
            İleri
          </button>
        </Card>
      </div>
    );
  }

  // Step 2: Barber
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Adım 2: Berber Seçin</p>
        <Card>
          <div className="flex flex-col gap-4 mb-6">
            {barbersList.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBarber(b.name)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition
                  ${selectedBarber === b.name
                    ? "bg-primary text-white shadow"
                    : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
                type="button"
              >
                <img src={b.img} alt={b.name} className="w-12 h-12 rounded-full border-2 border-accent shadow" />
                <span className="font-semibold">{b.name}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
            >
              Geri
            </button>
            <button
              disabled={!selectedBarber}
              onClick={() => setStep(3)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              İleri
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 3: Date/Time
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Adım 3: Tarih & Saat</p>
        <Card>
          <div className="mb-6 flex flex-col gap-3">
            <label className="text-gray-700 font-semibold">Tarih:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
            <label className="text-gray-700 font-semibold mt-2">Saat:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
            >
              Geri
            </button>
            <button
              disabled={!date || !time}
              onClick={() => setStep(4)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              İleri
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 4: Customer Info
  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Adım 4: Bilgileriniz</p>
        <Card>
          <div className="mb-6 flex flex-col gap-3">
            <label className="text-gray-700 font-semibold">Ad Soyad:</label>
            <input
              placeholder="Adınızı girin"
              value={customer.name}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, name: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
            <label className="text-gray-700 font-semibold">Telefon:</label>
            <input
              placeholder="Telefon numarası"
              value={customer.phone}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, phone: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
            <label className="text-gray-700 font-semibold">E-posta (opsiyonel):</label>
            <input
              placeholder="E-posta adresi"
              value={customer.email}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, email: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
            >
              Geri
            </button>
            <button
              disabled={!customer.name || !customer.phone}
              onClick={() => setStep(5)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              İleri
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 5: Payment
  if (step === 5) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Adım 5: Ödeme Seçeneği</p>
        <Card>
          <div className="mb-6 flex flex-col gap-4">
            {[
              { val: "deposit", label: "Şimdi kapora öde (kalanı dükkanda)" },
              { val: "full-online", label: "Tüm ücreti şimdi öde" },
              { val: "in-shop", label: "Dükkanda öde (nakit/kart)" }
            ].map(opt => (
              <label
                key={opt.val}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition cursor-pointer
                  ${payment === opt.val
                    ? "bg-primary text-white shadow"
                    : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === opt.val}
                  onChange={() => setPayment(opt.val)}
                  className="accent-accent"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
            >
              Geri
            </button>
            <button
              disabled={!payment}
              onClick={() => setStep(6)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              İleri
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 6: Review
  if (step === 6) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Tıraş Randevusu</h1>
        <p className="mb-6 text-gray-500">Son Kontrol & Onay</p>
        <Card>
          <div className="mb-6 space-y-2">
            <div><span className="font-semibold">Hizmetler:</span> {selectedServices.join(", ")}</div>
            <div><span className="font-semibold">Berber:</span> {selectedBarber}</div>
            <div><span className="font-semibold">Tarih:</span> {date}</div>
            <div><span className="font-semibold">Saat:</span> {time}</div>
            <div><span className="font-semibold">Ad Soyad:</span> {customer.name}</div>
            <div><span className="font-semibold">Telefon:</span> {customer.phone}</div>
            <div><span className="font-semibold">E-posta:</span> {customer.email}</div>
            <div><span className="font-semibold">Ödeme:</span> {payment}</div>
          </div>
          <button
            onClick={() => setStep(7)}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow transition hover:bg-accent hover:text-primary"
          >
            Randevuyu Onayla
          </button>
          <button
            onClick={() => setStep(5)}
            className="w-full mt-2 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
          >
            Geri
          </button>
        </Card>
      </div>
    );
  }

  // Step 7: Success
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <h1 className="text-4xl font-logo text-accent mb-4">Randevunuz Onaylandı!</h1>
      <div className="bg-white rounded-3xl shadow-soft p-8 border border-primary/10 max-w-md w-full animate-fade-in">
        <p className="text-primary text-lg mb-4">Teşekkürler, {customer.name}! Randevunuz başarıyla alındı.</p>
        <div className="mb-4">
          <span className="block text-gray-500">Detaylar:</span>
          <ul className="text-primary mt-2 space-y-1">
            <li><b>Hizmetler:</b> {selectedServices.join(", ")}</li>
            <li><b>Berber:</b> {selectedBarber}</li>
            <li><b>Tarih/Saat:</b> {date} {time}</li>
          </ul>
        </div>
        <button
          onClick={() => {
            setStep(1);
            setSelectedServices([]);
            setSelectedBarber("");
            setDate("");
            setTime("");
            setCustomer({ name: "", phone: "", email: "" });
            setPayment("");
          }}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow transition hover:bg-accent hover:text-primary"
        >
          Yeni Randevu Al
        </button>
      </div>
    </div>
  );
}
