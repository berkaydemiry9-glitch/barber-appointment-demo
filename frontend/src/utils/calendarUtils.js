// Helper functions for appointment slot calculation

function timeStringToMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTimeString(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function addMinutesHHMM(hhmm, mins) {
  return minutesToTimeString(timeStringToMinutes(hhmm) + mins);
}

export function getAvailableSlots({ workingHours, appointments, totalDuration, dateStr, slotInterval = 30 }) {
  const day = new Date(dateStr).getDay();
  const hours = workingHours[day];
  if (!hours) return [];

  const startMins = timeStringToMinutes(hours.start);
  const endMins = timeStringToMinutes(hours.end);
  const taken = (appointments || [])
    .filter(a => a.dateISO === dateStr)
    .map(a => ({ start: timeStringToMinutes(a.start), end: timeStringToMinutes(a.end) }));

  const slots = [];
  for (let slotStart = startMins; slotStart + totalDuration <= endMins; slotStart += slotInterval) {
    const slotEnd = slotStart + totalDuration;
    const overlap = taken.some(t => !(slotEnd <= t.start || slotStart >= t.end));
    if (!overlap) slots.push(minutesToTimeString(slotStart));
  }
  return slots;
}

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
