import barberPole from "./barber-pole.svg";

// ...
<div className="barber-header">
  <span className="barber-pole" style={{ backgroundImage: `url(${barberPole})` }} />
  Atlanta Barber Shop
</div>
import React, { useState } from "react";
import "./barber-theme.css";

// Services (Atlanta)
const servicesList = [
  { name: "Haircut", icon: "💈", duration: 30 },
  { name: "Beard Trim", icon: "🧔", duration: 20 },
  { name: "Kids Haircut", icon: "🧒", duration: 25 },
  { name: "Hot Towel Shave", icon: "🪒", duration: 25 },
  { name: "Line Up", icon: "✂️", duration: 15 },
  { name: "Fade", icon: "🎯", duration: 35 },
  { name: "Shampoo & Style", icon: "🚿", duration: 20 },
  { name: "Facial", icon: "🧖‍♂️", duration: 30 },
];

// Barbers
const barbersList = [
  {
    name: "Mike Johnson",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    workingHours: [null,{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"17:00"}],
    appointments: [],
  },
  {
    name: "Chris Evans",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    workingHours: [null,{start:"10:00",end:"18:00"},{start:"09:00",end:"18:00"},{start:"10:00",end:"19:00"},{start:"09:30",end:"18:30"},{start:"11:00",end:"19:00"},{start:"09:00",end:"16:00"}],
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
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }),
      dayIdx: d.getDay(),
    };
  });
}
function to12Hour(hour, minute) {
  const ampm = hour >= 12 ? "PM" : "AM";
  let h = hour % 12;
  if (h === 0) h = 12;
  return `${h}:${String(minute).padStart(2,"0")} ${ampm}`;
}
function getAvailableSlots({ workingHours, appointments, totalDuration, dateStr, slotInterval = 30 }) {
  const d = new Date(dateStr);
  const dayIdx = d.getDay();
  const wh = workingHours[dayIdx];
  if (!wh) return [];
  const slots = [];
  let [h,m] = wh.start.split(":").map(Number);
  const [eh,em] = wh.end.split(":").map(Number);
  const totalSlots = ((eh*60+em) - (h*60+m)) / slotInterval;
  for (let i=0;i<totalSlots;i++){
    const slotStart = (h*60+m) + i*slotInterval;
    const slotEnd = slotStart + totalDuration;
    if (slotEnd > (eh*60+em)) break;
    const hour = Math.floor(slotStart/60);
    const minute = slotStart % 60;
    // (appointments overlap check can be added later)
    slots.push(to12Hour(hour, minute));
  }
  return slots;
}
function addMinutes(time, mins) {
  const [t, meridian] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (meridian === "PM" && h !== 12) h += 12;
  if (meridian === "AM" && h === 12) h = 0;
  const d = new Date(2024,0,1,h,m+mins);
  let hour = d.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour || 12;
  return `${hour}:${String(d.getMinutes()).padStart(2,"0")} ${ampm}`;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // Step 1
  if (step === 1) {
    const total = sumDurations(selectedServices);
    return (
      <div style={layout}>
        <div className="barber-header">
          <span className="barber-pole" style={{ backgroundImage:`url(${barberPole})` }} />
          Atlanta Barber Shop
        </div>
        <div className="barber-card" style={{ maxWidth:600 }}>
          <h2 style={title}>Choose Your Service(s)</h2>
          <div className="barber-services">
            {servicesList.map(s => (
              <div
                key={s.name}
                className={`barber-service${selectedServices.includes(s.name) ? " selected":""}`}
                onClick={() =>
                  setSelectedServices(prev =>
                    prev.includes(s.name) ? prev.filter(x=>x!==s.name) : [...prev, s.name]
                  )
                }
              >
                <span style={{ fontSize:"1.7em" }}>{s.icon}</span>
                <span>{s.name}</span>
                <span style={{ fontSize:"0.85em", color:"#b93434", fontWeight:400 }}>{s.duration} min</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"right", color:"#b93434", marginTop:10 }}>
            <b>Total Duration:</b> {total} min
          </div>
          <button
            className="barber-btn"
            style={{ width:"100%", marginTop:24 }}
            disabled={selectedServices.length===0}
            onClick={()=>setStep(2)}
          >Next</button>
        </div>
      </div>
    );
  }

  // Step 2
  if (step === 2) {
    return (
      <div style={layout}>
        <div className="barber-header">
          <span className="barber-pole" style={{ backgroundImage:`url(${barberPole})` }} />
          Atlanta Barber Shop
        </div>
        <div className="barber-card" style={{ maxWidth:600 }}>
          <h2 style={title}>Choose Your Barber</h2>
          <div style={{ display:"flex", gap:30, justifyContent:"center", marginBottom:30, flexWrap:"wrap" }}>
            {barbersList.map(b => (
              <button
                key={b.name}
                onClick={()=>{ setSelectedBarber(b); setStep(3); }}
                style={{
                  border: selectedBarber?.name===b.name ? "2.5px solid #f6c453":"2px solid #b93434",
                  background: selectedBarber?.name===b.name ? "#b93434":"#fff6ec",
                  color: selectedBarber?.name===b.name ? "#fff":"#1a2233",
                  borderRadius:16,
                  padding:18,
                  boxShadow:"0 1px 8px #1a223344",
                  cursor:"pointer",
                  minWidth:140,
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:8,
                  fontWeight:500,
                  fontSize:"1.05em"
                }}
              >
                <img src={b.img} alt={b.name} style={{ width:58, height:58, borderRadius:"50%", border:"2.5px solid #f6c453" }} />
                {b.name}
              </button>
            ))}
          </div>
          <button className="barber-btn" style={{ width:"100%" }} onClick={()=>setStep(1)}>Back</button>
        </div>
      </div>
    );
  }

  // Step 3
  if (step === 3) {
    const total = sumDurations(selectedServices);
    const days = getNext7Days();
    const available = date && selectedBarber
      ? getAvailableSlots({
          workingHours: selectedBarber.workingHours,
          appointments: selectedBarber.appointments,
          totalDuration: total,
          dateStr: date,
          slotInterval: 30
        }) : [];
    return (
      <div style={layout}>
        <div className="barber-header">
          <span className="barber-pole" style={{ backgroundImage:`url(${barberPole})` }} />
          Atlanta Barber Shop
        </div>
        <div className="barber-card" style={{ maxWidth:600 }}>
          <h2 style={title}>Pick Date & Time</h2>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", marginBottom:18 }}>
            {days.map(d=>(
              <button
                key={d.dateStr}
                onClick={()=>{ setDate(d.dateStr); setSlot(""); }}
                className="barber-btn"
                style={{
                  background: date===d.dateStr ? "#b93434":"#fff",
                  color: date===d.dateStr ? "#fff":"#b93434",
                  border:"1.5px solid #b93434",
                  fontWeight:600,
                  fontSize:15,
                  padding:"0.55em 0.9em"
                }}
              >{d.label}</button>
            ))}
          </div>
          {date && (
            <>
              <div style={{ color:"#b93434", fontWeight:600, textAlign:"center", marginBottom:8 }}>Available Slots:</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginBottom:18 }}>
                {available.length===0 && <span style={{ color:"#888" }}>No slots</span>}
                {available.map(t=>(
                  <button
                    key={t}
                    onClick={()=>setSlot(t)}
                    className="barber-btn"
                    style={{
                      background: slot===t ? "#f6c453":"#fff",
                      color:"#b93434",
                      border:"1.5px solid #b93434",
                      fontWeight:600,
                      fontSize:14,
                      padding:"0.45em 0.9em"
                    }}
                  >{t} - {addMinutes(t, total)}</button>
                ))}
              </div>
            </>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <button className="barber-btn" style={{ flex:1 }} onClick={()=>setStep(2)}>Back</button>
            <button
              className="barber-btn"
              style={{ flex:1, background: !date||!slot ? "#b9343488":"" }}
              disabled={!date || !slot}
              onClick={()=>setStep(4)}
            >Next</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4
  if (step === 4) {
    return (
      <div style={layout}>
        <div className="barber-header">
          <span className="barber-pole" style={{ backgroundImage:`url(${barberPole})` }} />
          Atlanta Barber Shop
        </div>
        <div className="barber-card" style={{ maxWidth:600 }}>
          <h2 style={title}>Your Information</h2>
          <input placeholder="Full Name" value={customer.name} onChange={e=>setCustomer(c=>({...c,name:e.target.value}))} />
          <input placeholder="Phone" value={customer.phone} onChange={e=>setCustomer(c=>({...c,phone:e.target.value}))} />
          <input placeholder="Email (optional)" value={customer.email} onChange={e=>setCustomer(c=>({...c,email:e.target.value}))} />
          <div style={{ display:"flex", gap:8 }}>
            <button className="barber-btn" style={{ flex:1 }} onClick={()=>setStep(3)}>Back</button>
            <button
              className="barber-btn"
              style={{ flex:1, background: !customer.name||!customer.phone ? "#b9343488":"" }}
              disabled={!customer.name || !customer.phone}
              onClick={()=>setStep(5)}
            >Confirm</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 5 (Success)
  return (
    <div style={layout}>
      <div className="barber-header">
        <span className="barber-pole" style={{ backgroundImage:`url(${barberPole})` }} />
        Atlanta Barber Shop
      </div>
      <div className="barber-card" style={{ maxWidth:600, textAlign:"center" }}>
        <h2 style={{ color:"#b93434", marginBottom:18 }}>Appointment Confirmed!</h2>
        <p style={{ color:"#1a2233", fontSize:"1.08em" }}>
          Thank you <b>{customer.name}</b>! Your appointment is booked.
        </p>
        <div style={{ textAlign:"left", margin:"1.2em 0", color:"#b93434", lineHeight:1.4 }}>
          <b>Services:</b> {selectedServices.join(", ")}<br />
          <b>Barber:</b> {selectedBarber?.name}<br />
            <b>Date:</b> {date} <br />
          <b>Time:</b> {slot}<br />
          <b>Phone:</b> {customer.phone}
        </div>
        <button
          className="barber-btn"
          style={{ width:"100%" }}
          onClick={()=>{
            setStep(1);
            setSelectedServices([]);
            setSelectedBarber(null);
            setDate("");
            setSlot("");
            setCustomer({ name:"", phone:"", email:"" });
          }}
        >Book Another</button>
      </div>
    </div>
  );
}

const layout = { minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1rem" };
const title = { textAlign:"center", color:"#b93434", marginBottom:"1.2rem" };
