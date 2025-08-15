import React, { useMemo } from "react";
import { getNext7Days, getAvailableSlots, addMinutesHHMM } from "../../utils/calendarUtils";

export default function ScheduleStep({ barber, services, selectedServiceIds, dateISO, setDateISO, time, setTime, onBack, onNext }) {
  const totalDuration = useMemo(
    () => services.filter(s=>selectedServiceIds.includes(s.id)).reduce((a,b)=>a+b.durationMin,0),
    [services, selectedServiceIds]
  );
  const days = getNext7Days();

  const slots = useMemo(() => {
    if (!dateISO || !barber) return [];
    // in this step we don’t know barber's existing appointments yet; parent can pass them, or fetch server-side.
    return getAvailableSlots({
      workingHours: barber.workingHours,
      appointments: [], // we’ll rely on server collision check at final submit
      totalDuration,
      dateStr: dateISO
    });
  }, [dateISO, barber, totalDuration]);

  return (
    <div className="app-shell fade-in">
      <div className="hero-section">
        <h1 className="h1-brand">Pick Date & Time</h1>
        <div className="subtext">Step 3</div>
      </div>

      <div className="services-panel" style={{ maxWidth: 880 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:".6rem", marginBottom:"1.1rem" }}>
          {days.map(d => (
            <button
              key={d.dateStr}
              className="btn btn-secondary"
              style={{
                minWidth:120,
                background: dateISO===d.dateStr ? "linear-gradient(90deg,#1e3a8a,#2563eb)" : "#fff",
                color: dateISO===d.dateStr ? "#fff" : "var(--color-primary)",
                borderColor: dateISO===d.dateStr ? "transparent" : "var(--color-border)"
              }}
              onClick={() => { setDateISO(d.dateStr); setTime(""); }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {dateISO && (
          <>
            <div style={{ fontSize:".75rem", fontWeight:600, letterSpacing:".7px", color:"var(--color-text-light)", textTransform:"uppercase", marginBottom:".5rem" }}>
              Available Slots
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".55rem", marginBottom:"1.2rem" }}>
              {slots.length === 0 && <span style={{ fontSize:".85rem", color:"#9ca3af" }}>No slots for this day</span>}
              {slots.map(t => (
                <button
                  key={t}
                  className="btn btn-secondary"
                  style={{
                    background: time===t ? "linear-gradient(90deg,#1e3a8a,#2563eb)" : "#fff",
                    color: time===t ? "#fff" : "var(--color-primary)",
                    padding:".55rem .85rem", minWidth:"unset"
                  }}
                  onClick={() => setTime(t)}
                >
                  {t} – {addMinutesHHMM(t, totalDuration)}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:".75rem", justifyContent:"flex-end" }}>
          <button className="btn btn-secondary" onClick={onBack}>Back</button>
          <button className="btn" onClick={onNext} disabled={!dateISO || !time}>Next</button>
        </div>
      </div>
    </div>
  );
}
