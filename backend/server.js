// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ---- In-memory data store (swap to DB later) ----
let SERVICES = [
  { id: "haircut", name: "Haircut", durationMin: 30, price: 30 },
  { id: "beard", name: "Beard Trim", durationMin: 20, price: 15 },
  { id: "kids", name: "Kids Haircut", durationMin: 25, price: 20 },
  { id: "hotTowel", name: "Hot Towel Shave", durationMin: 25, price: 22 },
  { id: "lineup", name: "Line Up", durationMin: 15, price: 10 },
  { id: "fade", name: "Fade", durationMin: 35, price: 35 },
  { id: "shampoo", name: "Shampoo & Style", durationMin: 20, price: 12 },
  { id: "facial", name: "Facial", durationMin: 30, price: 35 }
];

let BARBERS = [
  {
    id: "mike",
    name: "Mike Johnson",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    workingHours: [null,{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"19:00"},{start:"09:00",end:"17:00"}]
  },
  {
    id: "chris",
    name: "Chris Evans",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    workingHours: [null,{start:"10:00",end:"18:00"},{start:"09:00",end:"18:00"},{start:"10:00",end:"19:00"},{start:"09:30",end:"18:30"},{start:"11:00",end:"19:00"},{start:"09:00",end:"16:00"}]
  }
];

// One array for all appointments:
// { id, customerName, phone, email, services:[ids], barberId, dateISO:"YYYY-MM-DD", start:"HH:MM", end:"HH:MM", totalPrice, totalDurationMin, payment:"paid-online"|"in-shop" }
let APPOINTMENTS = [];

// ---- Admin auth (super simple token) ----
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "barber123";
const ADMIN_TOKEN = "admin-demo-token";

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ token: ADMIN_TOKEN });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// ---- Public endpoints ----
app.get("/api/services", (_req, res) => res.json(SERVICES));
app.get("/api/barbers", (_req, res) => res.json(BARBERS));
app.get("/api/appointments", (req, res) => {
  const { from, to } = req.query;
  let data = APPOINTMENTS;
  if (f
