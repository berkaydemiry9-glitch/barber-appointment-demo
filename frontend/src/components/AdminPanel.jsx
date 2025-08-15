import React, { useEffect, useState } from "react";
import { adminMetrics, adminAppointments, adminDeleteAppointment } from "../api/api";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function AdminPanel({ onBack }) {
  const [metrics, setMetrics] = useState(null);
  const [appointments, setAppointments] = useState([]);

  async function refresh() {
    const [m, a] = await Promise.all([adminMetrics(), adminAppointments()]);
    setMetrics(m);
    setAppointments(a);
  }
  useEffect(() => { refresh(); }, []);

  function getUpcoming(list) {
    const now = new Date();
    return list
      .map(a => ({ ...a, dt: new Date(`${a.dateISO}T${a.start}`) }))
      .filter(a => a.dt >= now)
      .sort((a,b) => a.dt - b.dt);
  }

  async function remove(id) {
    await adminDeleteAppointment(id);
    refresh();
  }

  const upcoming = getUpcoming(appointments);

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-logo text-primary">Barbershop Admin Panel</h1>
          <button onClick={onBack} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-accent hover:text-primary transition">
            Back to App
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Total Appointments" value={metrics?.totalAppointments ?? 0} icon="📅" />
          <SummaryCard label="Total Customers" value={metrics?.uniqueCustomers ?? 0} icon="👥" />
          <SummaryCard label="Total Revenue" value={usd.format(metrics?.totalRevenue ?? 0)} icon="💵" />
          <SummaryCard label="Avg. Revenue/App." value={metrics && metrics.totalAppointments ? usd.format(metrics.totalRevenue / metrics.totalAppointments) : usd.format(0)} icon="📊" />
        </div>

        {/* Barber Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-primary">Barber Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics && Object.entries(metrics.byBarber).map(([barberId, stat]) => (
              <div key={barberId} className="p-4 rounded-xl bg-white shadow-soft border border-primary/10">
                <div className="font-semibold text-primary">{barberId}</div>
                <div className="mt-2 flex gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-1">Appointments: <b>{stat.count}</b></div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">Revenue: <b>{usd.format(stat.revenue)}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Table */}
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
                  <th className="px-3 py-2">Actions</th>
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
                    <td className="px-3 py-2">{a.dateISO}</td>
                    <td className="px-3 py-2">{a.start} – {a.end}</td>
                    <td className="px-3 py-2">{a.customerName}</td>
                    <td className="px-3 py-2">{a.barberId}</td>
                    <td className="px-3 py-2">{a.services.join(", ")}</td>
                    <td className="px-3 py-2">{usd.format(a.totalPrice || 0)}</td>
                    <td className="px-3 py-2">
                      <button className="btn btn-secondary" onClick={() => remove(a.id)}>Delete</button>
                    </td>
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
