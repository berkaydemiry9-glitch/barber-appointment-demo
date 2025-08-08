import React, { useState } from "react";

const ADMIN_USER = "admin";
const ADMIN_PASS = "barber123"; // Dilersen değiştir

export default function AdminLogin({ onSuccess, onCancel }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setError("");
      onSuccess();
    } else {
      setError("Wrong username or password!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-soft border border-primary/10 animate-fade-in flex flex-col gap-4"
      >
        <h2 className="text-2xl font-logo text-primary mb-2 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="border rounded-xl px-3 py-2 focus:outline-accent"
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="border rounded-xl px-3 py-2 focus:outline-accent"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border text-primary border-primary/40 bg-bg hover:bg-primary/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-xl bg-accent text-primary font-semibold shadow hover:bg-primary hover:text-white"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
