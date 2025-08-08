// Helper functions for appointment slot calculation

// Parse "09:00" to minutes (540)
function timeStringToMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// Format minutes to "09:00"
function minutesToTimeString(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Given barber's working hours, appointments, totalDuration, and dateStr ("2025-08-08"), returns available slot start times (array of "HH:MM")
export function getAvailableSlots({ workingHours, appointments, totalDuration, dateStr, slotInterval = 30 }) {
  // Get working hours for selected day (e.g. { start: "09:00", end: "19:00" })
  const day = new Date(dateStr).getDay();
  const hours = workingHours[day]; // 0=Sunday, 1=Monday...
  if (!hours) return [];

  const startMins = timeStringToMinutes(hours.start);
  const endMins = timeStringToMinutes(hours.end);

  // Collect taken periods (in minutes)
  const taken = appointments
    .filter(a => a.date === dateStr)
    .map(a => ({
      start: timeStringToMinutes(a.start),
      end: timeStringToMinutes(a.end)
    }));

  // Build all possible slot starts
  const slots = [];
  for (
    let slotStart = startMins;
    slotStart + totalDuration <= endMins;
    slotStart += slotInterval
  ) {
    const slotEnd = slotStart + totalDuration;
    // Check overlap with taken
    const overlap = taken.some(
      t => !(slotEnd <= t.start || slotStart >= t.end)
    );
    if (!overlap) {
      slots.push(minutesToTimeString(slotStart));
    }
  }
  return slots;
}

// Returns next 7 days as { dateStr: "YYYY-MM-DD", label: "Mon, Aug 12" }
export function getNext7Days() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      dateStr: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    });
  }
  return days;
}
