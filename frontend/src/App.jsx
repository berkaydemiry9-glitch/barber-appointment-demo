import React, { useEffect, useMemo, useState } from "react";
import "./barber-theme.css";
import { getServices, getBarbers, createAppointment } from "./api/api";
import ServicesStep from "./components/steps/ServicesStep";
import BarberStep from "./components/steps/BarberStep";
import ScheduleStep from "./components/steps/ScheduleStep";
import DetailsStep from "./components/steps/DetailsStep";
import ReviewConfirmStep from "./components/steps/ReviewConfirmStep";
import BookingSuccess from "./components/steps/BookingSuccess";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [mode, setMode] = useState("book"); // "book" | "adminLogin" | "admin"
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  // booking state
  const [step, setStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [dateISO, setDateISO] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", notes: "" });
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    (async () => {
      const [s, b] = await Promise.all([getServices(), getBarbers()]);
      setServices(s);
      setBarbers(b);
    })();
  }, []);

  const draft = useMemo(() => {
    const selected = services.filter(s => selectedServiceIds.includes(s.id));
    const totalDurationMin = selected.reduce((a,b)=>a+b.durationMin,0);
    const totalPrice = selected.reduce((a,b)=>a+(b.price||0),0);
    return {
      services: selected,
      barber: selectedBarber ? { id: selectedBarber.id, name: selectedBarber.name } : undefined,
      dateISO,
      timeLabel: time,
      phone: customer.phone,
      email: customer.email,
      notes: customer.notes,
      totalDurationMin,
      totalPrice
    };
  }, [services, selectedServiceIds, selectedBarber, dateISO, time, customer]);

  async function confirmBooking() {
    // Build payload for backend
    const start = time; // "HH:MM"
    const end = addMinutes(time, draft.totalDurationMin);
    const payload = {
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      services: selectedServiceIds,
      barberId: selectedBarber.id,
      dateISO,
      start,
      end,
      totalPrice: draft.totalPrice,
      totalDurationMin: draft.totalDurationMin,
      payment: "in-shop",
      notes: customer.notes
    };
    const created = await createAppointment(payload);
    setBookingCode(created.id);
    setStep(6);
  }

  function addMinutes(hhmm, mins) {
    const [h, m] = hhmm.split(":").map(Number);
    const total = h*60 + m + mins;
    const hh = String(Math.floor(total/60)).padStart(2,"0");
    const mm = String(total%60).padStart(2,"0");
    return `${hh}:${mm}`;
  }

  const headerActions = (
    <div style={{ position:"fixed", top:14, right:14, display:"flex", gap:8 }}>
      {mode !== "admin" && (
        <button className="btn btn-secondary" onClick={() => setMode(mode==="adminLogin" ? "book" : "adminLogin")}>
          {mode==="adminLogin" ? "Back to Booking" : "Admin"}
        </button>
      )}
      {mode === "admin" && (
        <button className="btn btn-secondary" onClick={() => setMode("book")}>Exit Admin</button>
      )}
    </div>
  );

  if (mode === "adminLogin") {
    return (
      <>
        {headerActions}
        <AdminLogin onSuccess={() => setMode("admin")} onCancel={() => setMode("book")} />
      </>
    );
  }
  if (mode === "admin") {
    return (
      <>
        {headerActions}
        <AdminPanel onBack={() => setMode("book")} />
      </>
    );
  }

  // Booking flow
  switch (step) {
    case 1:
      return (
        <>
          {headerActions}
          <ServicesStep
            services={services}
            selectedIds={selectedServiceIds}
            setSelectedIds={setSelectedServiceIds}
            onNext={() => setStep(2)}
          />
        </>
      );
    case 2:
      return (
        <>
          {headerActions}
          <BarberStep
            barbers={barbers}
            selected={selectedBarber}
            setSelected={setSelectedBarber}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        </>
      );
    case 3:
      return (
        <>
          {headerActions}
          <ScheduleStep
            barber={selectedBarber}
            services={services}
            selectedServiceIds={selectedServiceIds}
            dateISO={dateISO}
            setDateISO={setDateISO}
            time={time}
            setTime={setTime}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        </>
      );
    case 4:
      return (
        <>
          {headerActions}
          <DetailsStep
            customer={customer}
            setCustomer={setCustomer}
            onBack={() => setStep(3)}
