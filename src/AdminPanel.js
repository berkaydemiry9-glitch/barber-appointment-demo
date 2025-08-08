import React from "react";

// Dummy service prices
const servicePrices = {
  "Haircut": 30,
  "Beard Trim": 15,
  "Kids Haircut": 20,
  "Shave": 18,
  "Haircut & Beard Combo": 40,
  "Line Up": 10,
  "Head Shave": 25,
  "Hot Towel Shave": 22,
  "Hair Wash & Style": 12,
  "Facial": 35
};

// Dummy appointments data
const appointments = [
  {
    id: 1,
    customer: "John Doe",
    barber: "Mike Johnson",
    date: "2025-08-08",
    time: "10:00",
    services: ["Haircut", "Beard Trim"],
    total: 45,
    payment: "Paid Online"
  },
  {
    id: 2,
    customer: "Alice Smith",
    barber: "Alex Smith",
    date: "2025-08-08",
    time: "11:00",
    services: ["Haircut"],
    total: 30,
    payment: "In Shop"
  },
  {
    id: 3,
    customer: "Michael Brown",
    barber: "Mike Johnson",
    date: "2025-08-09",
    time: "09:30",
    services: ["Facial", "Hair Wash & Style"],
    total: 47,
    payment: "Paid Online"
  }
  // Add more dummy appointments as needed
];

// Utility functions
function getUniqueCustomers(appointments) {
  return [...new Set(appointments.map(a => a.customer))];
}
function getTotalRevenue(appointments) {
  return appointments.reduce((sum, a) => sum + a.total, 0);
}
function getBarberStats(appointments) {
  const stats = {};
  for (const a of appointments) {
    if (!stats[a.barber]) stats[a.barber] = { count: 0, revenue: 0 };
    stats[a.barber].count += 1;
    stats[a.barber].revenue += a.total;
  }
  return stats;
}
function getUpcoming(appointments) {
  const now = new Date();
  return appointments.filter(a => new Date(`${a.date}T${a.time}`) >= now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
}

export default function AdminPanel({ onBack }) {
  const totalAppointments = appointments.length;
  const uniqueCustomers = getUniqueCustomers(appointments).length;
  const totalRevenue = getTotalRevenue(appointments);
  const avgRevenue = totalAppointments ? (totalRevenue / totalAppointments).toFixed(2) : 0;
  const barberStats = getBarberStats(appointments);
  const upcoming = getUpcoming(appointments);

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-logo text-primary">Barbershop Admin Panel</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-accent hover:text-primary transition"
          >
            Back to App
          </button>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Total Appointments" value={totalAppointments} icon="📅" />
          <SummaryCard label="Total Customers" value={uniqueCustomers} icon="👥" />
          <SummaryCard label="Total Revenue" value={`$${totalRevenue}`} icon="💵" />
          <SummaryCard label="Avg. Revenue/App." value={`$${avgRevenue}`} icon="📊" />
        </div>

        {/* Barber Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-primary">Barber Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(barberStats).map(([barber, stat]) => (
              <div key={barber} className="p-4 rounded-xl bg-white shadow-soft border border-primary/10">
                <div className="font-semibold text-primary">{barber}</div>
                <div className="mt-2 flex gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-1">Appointments: <b>{stat.count}</b></div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">Revenue: <b>${stat.revenue}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-primary">Upcoming Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow border border-primary/10">
              <thead>
                <tr className="bg-primary/5 text-primary">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Barber</th>
                  <th className="px-3 py-2">Services</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">No upcoming appointments</td>
                  </tr>
                )}
                {upcoming.map(a => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{a.date}</td>
                    <td className="px-3 py-2">{a.time}</td>
                    <td className="px-3 py-2">{a.customer}</td>
                    <td className="px-3 py-2">{a.barber}</td>
                    <td className="px-3 py-2">{a.services.join(", ")}</td>
                    <td className="px-3 py-2">${a.total}</td>
                    <td className="px-3 py-2">{a.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-primary/10 flex flex-col items-center gap-2">
      <div className="text-3xl">{icon}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}
