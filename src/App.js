import React, { useState } from "react";

const servicesList = [
  "Haircut",
  "Beard Trim",
  "Kids Haircut",
  "Shave",
  "Haircut & Beard Combo",
  "Line Up",
  "Head Shave",
  "Hot Towel Shave",
  "Hair Wash & Style",
  "Facial",
];

const barbersList = [
  "Mike Johnson",
  "Alex Smith",
  "Any available barber"
];

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [payment, setPayment] = useState("");

  if (step === 1) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Choose your service</h2>
        {servicesList.map((s) => (
          <div key={s}>
            <label>
              <input
                type="checkbox"
                checked={selectedServices.includes(s)}
                onChange={() => {
                  setSelectedServices((prev) =>
                    prev.includes(s)
                      ? prev.filter((x) => x !== s)
                      : [...prev, s]
                  );
                }}
              />
              {s}
            </label>
          </div>
        ))}
        <button
          disabled={selectedServices.length === 0}
          onClick={() => setStep(2)}
        >
          Next
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Select your barber</h2>
        {barbersList.map((b) => (
          <div key={b}>
            <label>
              <input
                type="radio"
                name="barber"
                checked={selectedBarber === b}
                onChange={() => setSelectedBarber(b)}
              />
              {b}
            </label>
          </div>
        ))}
        <button disabled={!selectedBarber} onClick={() => setStep(3)}>
          Next
        </button>
        <button onClick={() => setStep(1)}>Back</button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Pick date and time</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <br />
        <button
          disabled={!date || !time}
          onClick={() => setStep(4)}
        >
          Next
        </button>
        <button onClick={() => setStep(2)}>Back</button>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Your Information</h2>
        <input
          placeholder="Full name"
          value={customer.name}
          onChange={(e) =>
            setCustomer((c) => ({ ...c, name: e.target.value }))
          }
        />
        <br />
        <input
          placeholder="Phone number"
          value={customer.phone}
          onChange={(e) =>
            setCustomer((c) => ({ ...c, phone: e.target.value }))
          }
        />
        <br />
        <input
          placeholder="Email (optional)"
          value={customer.email}
          onChange={(e) =>
            setCustomer((c) => ({ ...c, email: e.target.value }))
          }
        />
        <br />
        <button
          disabled={!customer.name || !customer.phone}
          onClick={() => setStep(5)}
        >
          Next
        </button>
        <button onClick={() => setStep(3)}>Back</button>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Payment Option</h2>
        <label>
          <input
            type="radio"
            name="payment"
            checked={payment === "deposit"}
            onChange={() => setPayment("deposit")}
          />
          Pay deposit now (pay the rest in shop)
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="payment"
            checked={payment === "full-online"}
            onChange={() => setPayment("full-online")}
          />
          Pay full amount online now
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="payment"
            checked={payment === "in-shop"}
            onChange={() => setPayment("in-shop")}
          />
          Pay in shop (cash/card)
        </label>
        <br />
        <button disabled={!payment} onClick={() => setStep(6)}>
          Next
        </button>
        <button onClick={() => setStep(4)}>Back</button>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Review & Confirm</h2>
        <div>
          <strong>Services:</strong> {selectedServices.join(", ")}
        </div>
        <div>
          <strong>Barber:</strong> {selectedBarber}
        </div>
        <div>
          <strong>Date:</strong> {date}
        </div>
        <div>
          <strong>Time:</strong> {time}
        </div>
        <div>
          <strong>Name:</strong> {customer.name}
        </div>
        <div>
          <strong>Phone:</strong> {customer.phone}
        </div>
        <div>
          <strong>Email:</strong> {customer.email}
        </div>
        <div>
          <strong>Payment Option:</strong> {payment}
        </div>
        <button onClick={() => setStep(7)}>Confirm Appointment</button>
        <button onClick={() => setStep(5)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Appointment Confirmed!</h2>
      <p>Thank you for booking your appointment.</p>
      <button onClick={() => setStep(1)}>Book another</button>
    </div>
  );
}
