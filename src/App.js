import React, { useState } from "react";
import "./index.css";
import { getAvailableSlots, getNext7Days } from "./calendarUtils";

// --- Services: name, icon, duration (minutes)
const servicesList = [
  { name: "Haircut", icon: "💇‍♂️", duration: 30 },
  { name: "Beard Trim", icon: "🧔", duration: 20 },
  { name: "Kids Haircut", icon: "🧒", duration: 25 },
  { name: "Shave", icon: "🪒", duration: 20 },
  { name: "Haircut & Beard Combo", icon: "💇‍♂️🧔", duration: 45 },
  { name: "Line Up", icon: "✂️", duration: 15 },
  { name: "Head Shave", icon: "🧑‍🦲", duration: 30 },
  { name: "Hot Towel Shave", icon: "🧖‍♂️", duration: 25 },
  { name: "Hair Wash & Style", icon: "🚿", duration: 20 },
  { name: "Facial", icon: "🧖‍♀️", duration: 30 }
];

// --- Dummy barber data: name, img, working hours (per day), appointments
const barbersList = [
  {
    name: "Mike Johnson",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    workingHours: [
      null, // Sunday
      { start: "09:00", end: "19:00" }, // Monday
      { start: "09:00", end: "19:00" }, // Tuesday
      { start: "12:00", end: "19:00" }, // Wednesday (late start)
      { start: "09:00", end: "19:00" }, // Thursday
      { start: "09:00", end: "19:00" }, // Friday
      { start: "10:00", end: "17:00" }  // Saturday (shorter day)
    ],
    appointments: [
      // Example: an appointment on Monday, Aug 12: 10:00-10:45
      { date: "2025-08-11", start: "10:00", end: "10:45" }
    ]
  },
  {
    name: "Alex Smith",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    workingHours: [
      null,
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" },
      { start: "09:00", end: "19:00" }
    ],
    appointments: [
      // Tuesday blocked 11:00-12:00
      { date: "2025-08-12", start: "11:00", end: "12:00" }
    ]
  }
];

function sumDurations(selectedNames) {
  return servicesList
    .filter(s => selectedNames.includes(s.name))
    .reduce((a, b) => a + b.duration, 0);
}

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [payment, setPayment] = useState("");

  // Step 1: Select Services
  if (step === 1) {
    const total = sumDurations(selectedServices);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Step 1: Select Service(s)</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="grid grid-cols-2 gap-4 mb-4">
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
                <span className="ml-auto text-xs text-accent">{s.duration} min</span>
              </button>
            ))}
          </div>
          <div className="mb-4 text-right text-primary">
            <b>Total Duration:</b> {total} min
          </div>
          <button
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-accent text-primary font-semibold text-lg shadow transition hover:bg-primary hover:text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Choose Barber
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Step 2: Select Barber</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            {barbersList.map((b) => (
              <button
                key={b.name}
                onClick={() => { setSelectedBarber(b); setStep(3); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition
                  ${selectedBarber && selectedBarber.name === b.name
                    ? "bg-primary text-white shadow"
                    : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
                type="button"
              >
                <img src={b.img} alt={b.name} className="w-12 h-12 rounded-full border-2 border-accent shadow" />
                <span className="font-semibold">{b.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="py-2 px-4 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition">
            Back
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Date & Slot Selection
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Step 3: Pick Date & Time</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="mb-5">
            <div className="mb-1 text-primary font-semibold">Pick a day:</div>
            <div className="flex gap-2">
              {days.map(d => (
                <button
                  key={d.dateStr}
                  onClick={() => { setDate(d.dateStr); setSlot(""); }}
                  className={`px-3 py-2 rounded-xl border transition
                    ${date === d.dateStr
                      ? "bg-primary text-white shadow"
                      : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          {date && (
            <div>
              <div className="mb-1 text-primary font-semibold">Available time slots:</div>
              <div className="flex flex-wrap gap-2 mb-8">
                {availableSlots.length === 0 && (
                  <span className="text-gray-400 italic">No available slots for this day</span>
                )}
                {availableSlots.map(t => (
                  <button
                    key={t}
                    onClick={() => setSlot(t)}
                    className={`px-4 py-2 rounded-xl border transition
                      ${slot === t
                        ? "bg-accent text-primary shadow"
                        : "bg-bg border-primary/20 text-primary hover:bg-primary/10"}`}
                  >
                    {t} - {addMinutes(t, total)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition">
              Back
            </button>
            <button
              disabled={!date || !slot}
              onClick={() => setStep(4)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Customer Info
  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Step 4: Your Information</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="mb-6 flex flex-col gap-3">
            <label className="text-gray-700 font-semibold">Full name:</label>
            <input
              placeholder="Your name"
              value={customer.name}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, name: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
            <label className="text-gray-700 font-semibold">Phone:</label>
            <input
              placeholder="Phone number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, phone: e.target.value }))
              }
              className="w-full border rounded-xl px-3 py-2 focus:outline-accent"
            />
            <label className="text-gray-700 font-semibold">Email (optional):</label>
            <input
              placeholder="Email address"
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
              Back
            </button>
            <button
              disabled={!customer.name || !customer.phone}
              onClick={() => setStep(5)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Payment
  if (step === 5) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Step 5: Payment Option</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="mb-6 flex flex-col gap-4">
            {[
              { val: "deposit", label: "Pay deposit now (rest in shop)" },
              { val: "full-online", label: "Pay full amount now online" },
              { val: "in-shop", label: "Pay in shop (cash/card)" }
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
              Back
            </button>
            <button
              disabled={!payment}
              onClick={() => setStep(6)}
              className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Review & Confirm
  if (step === 6) {
    const total = sumDurations(selectedServices);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
        <h1 className="text-4xl font-logo text-primary mb-2">Barber Appointment</h1>
        <p className="mb-6 text-gray-500">Review & Confirm</p>
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in">
          <div className="mb-6 space-y-2">
            <div><span className="font-semibold">Services:</span> {selectedServices.join(", ")}</div>
            <div><span className="font-semibold">Barber:</span> {selectedBarber?.name}</div>
            <div><span className="font-semibold">Date:</span> {date}</div>
            <div><span className="font-semibold">Time:</span> {slot} - {addMinutes(slot, total)}</div>
            <div><span className="font-semibold">Name:</span> {customer.name}</div>
            <div><span className="font-semibold">Phone:</span> {customer.phone}</div>
            <div><span className="font-semibold">Email:</span> {customer.email}</div>
            <div><span className="font-semibold">Payment Option:</span> {payment}</div>
          </div>
          <button
            onClick={() => setStep(7)}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow transition hover:bg-accent hover:text-primary"
          >
            Confirm Appointment
          </button>
          <button
            onClick={() => setStep(5)}
            className="w-full mt-2 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Step 7: Success
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <h1 className="text-4xl font-logo text-accent mb-4">Appointment Confirmed!</h1>
      <div className="bg-white rounded-3xl shadow-soft p-8 border border-primary/10 max-w-md w-full animate-fade-in">
        <p className="text-primary text-lg mb-4">Thank you, {customer.name}! Your appointment is booked.</p>
        <div className="mb-4">
          <span className="block text-gray-500">Details:</span>
          <ul className="text-primary mt-2 space-y-1">
            <li><b>Services:</b> {selectedServices.join(", ")}</li>
            <li><b>Barber:</b> {selectedBarber?.name}</li>
            <li><b>Date/Time:</b> {date} {slot}</li>
          </ul>
        </div>
        <button
          onClick={() => {
            setStep(1);
            setSelectedServices([]);
            setSelectedBarber(null);
            setDate("");
            setSlot("");
            setCustomer({ name: "", phone: "", email: "" });
            setPayment("");
          }}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-lg shadow transition hover:bg-accent hover:text-primary"
        >
          Book Another
        </button>
      </div>
    </div>
  );
}

// Utility: add minutes to "HH:MM" string
function addMinutes(time, mins) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(2025, 0, 1, h, m + mins);
  return d.toTimeString().slice(0, 5);
}
