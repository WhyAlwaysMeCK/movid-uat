import express from "express";
import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.join(__dirname, "data");
const databasePath = path.join(dataDirectory, "satelle.sqlite");
const distDirectory = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 3001);
const basicAuthUser = process.env.UAT_BASIC_AUTH_USER || "";
const basicAuthPassword = process.env.UAT_BASIC_AUTH_PASSWORD || "";
const basicAuthEnabled = Boolean(basicAuthUser && basicAuthPassword);

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(databasePath);
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    slot TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT,
    consent INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    reason TEXT NOT NULL,
    message TEXT NOT NULL,
    consent INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS mail_events (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview TEXT NOT NULL,
    related_type TEXT NOT NULL,
    related_id TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const servicesCatalog = [
  { id: "psychology-signature", name: "Konsultacja psychodietetyczna" },
  { id: "psychology-couple", name: "Praca nad nawykami i kompulsywnością" },
  { id: "psychology-burnout", name: "Wsparcie w emocjonalnym jedzeniu i stresie" },
  { id: "nutrition-clinical", name: "Konsultacja dietetyczna kliniczna" },
  { id: "nutrition-performance", name: "Prowadzenie żywieniowe" },
  { id: "nutrition-family", name: "Wsparcie w budowaniu codziennych nawyków" }
];

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Wybierz usługę."),
  slot: z.string().datetime({ offset: true }),
  firstName: z.string().trim().min(2, "Wpisz imię."),
  lastName: z.string().trim().min(2, "Wpisz nazwisko."),
  email: z.string().trim().email("Podaj poprawny adres e-mail."),
  phone: z
    .string()
    .trim()
    .min(7, "Podaj poprawny numer telefonu.")
    .max(30, "Numer telefonu jest zbyt długi."),
  notes: z.string().trim().max(700, "Wiadomość jest zbyt długa.").optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Zgoda jest wymagana, aby wysłać rezerwację." })
  })
});

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Wpisz imię i nazwisko."),
  email: z.string().trim().email("Podaj poprawny adres e-mail."),
  phone: z.string().trim().max(30, "Numer telefonu jest zbyt długi.").optional().or(z.literal("")),
  reason: z.string().trim().min(2, "Wybierz powód kontaktu."),
  message: z.string().trim().min(20, "Napisz proszę trochę więcej przed wysłaniem.").max(1200),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Zgoda jest wymagana, aby wysłać wiadomość." })
  })
});

const insertBooking = db.prepare(`
  INSERT INTO bookings (
    id, service_id, service_name, slot, first_name, last_name, email, phone, notes, consent, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertContact = db.prepare(`
  INSERT INTO contacts (
    id, full_name, email, phone, reason, message, consent, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMailEvent = db.prepare(`
  INSERT INTO mail_events (
    id, kind, recipient, subject, preview, related_type, related_id, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const countBookingsBySlot = db.prepare(`
  SELECT COUNT(*) AS total
  FROM bookings
  WHERE slot = ?
`);

const countBookings = db.prepare(`SELECT COUNT(*) AS total FROM bookings`);
const countContacts = db.prepare(`SELECT COUNT(*) AS total FROM contacts`);
const countMailEvents = db.prepare(`SELECT COUNT(*) AS total FROM mail_events`);

const listRecentBookings = db.prepare(`
  SELECT *
  FROM bookings
  ORDER BY datetime(created_at) DESC
  LIMIT ?
`);

const listRecentContacts = db.prepare(`
  SELECT *
  FROM contacts
  ORDER BY datetime(created_at) DESC
  LIMIT ?
`);

const listRecentMailEvents = db.prepare(`
  SELECT *
  FROM mail_events
  ORDER BY datetime(created_at) DESC
  LIMIT ?
`);

const app = express();

app.use(express.json());
app.use(requireBasicAuth);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/availability", (request, response) => {
  const requestedServiceId = String(request.query.serviceId || "");
  const service = servicesCatalog.find((item) => item.id === requestedServiceId);

  if (!service) {
    return response.status(400).json({ message: "Najpierw wybierz poprawną usługę." });
  }

  return response.json({
    serviceId: service.id,
    days: buildAvailability()
  });
});

app.post("/api/bookings", (request, response) => {
  const parsed = bookingSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: parsed.error.issues[0]?.message || "Dane rezerwacji są nieprawidłowe."
    });
  }

  const service = servicesCatalog.find((item) => item.id === parsed.data.serviceId);

  if (!service) {
    return response.status(400).json({ message: "Wybrana usługa jest niedostępna." });
  }

  const requestedSlot = parsed.data.slot;
  const slotExists = buildAvailability()
    .flatMap((day) => day.slots)
    .some((slot) => slot.value === requestedSlot && slot.available);

  if (!slotExists) {
    return response.status(409).json({
      message: "Ten termin został właśnie zajęty. Wybierz inny."
    });
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  insertBooking.run(
    id,
    service.id,
    service.name,
    requestedSlot,
    parsed.data.firstName,
    parsed.data.lastName,
    parsed.data.email,
    parsed.data.phone,
    parsed.data.notes || "",
    1,
    createdAt
  );

  insertMailEvent.run(
    randomUUID(),
    "booking-admin",
    "uat-inbox",
    `Nowa rezerwacja testowa: ${service.name}`,
    `${parsed.data.firstName} ${parsed.data.lastName} wybrał(a) termin ${requestedSlot}.`,
    "booking",
    id,
    createdAt
  );

  insertMailEvent.run(
    randomUUID(),
    "booking-client",
    parsed.data.email,
    "Potwierdzenie testowej rezerwacji",
    `To testowe potwierdzenie rezerwacji dla usługi: ${service.name}.`,
    "booking",
    id,
    createdAt
  );

  return response.status(201).json({
    id,
    createdAt,
    message: "Rezerwacja została zapisana.",
    booking: {
      serviceName: service.name,
      slot: requestedSlot,
      fullName: `${parsed.data.firstName} ${parsed.data.lastName}`
    }
  });
});

app.post("/api/contact", (request, response) => {
  const parsed = contactSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: parsed.error.issues[0]?.message || "Dane wiadomości są nieprawidłowe."
    });
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  insertContact.run(
    id,
    parsed.data.fullName,
    parsed.data.email,
    parsed.data.phone || "",
    parsed.data.reason,
    parsed.data.message,
    1,
    createdAt
  );

  insertMailEvent.run(
    randomUUID(),
    "contact-admin",
    "uat-inbox",
    `Nowa wiadomość testowa: ${parsed.data.reason}`,
    `${parsed.data.fullName} zostawił(a) wiadomość przez formularz kontaktowy.`,
    "contact",
    id,
    createdAt
  );

  insertMailEvent.run(
    randomUUID(),
    "contact-client",
    parsed.data.email,
    "Potwierdzenie testowej wiadomości",
    "To jest testowe potwierdzenie wiadomości wysłanej w środowisku UAT.",
    "contact",
    id,
    createdAt
  );

  return response.status(201).json({
    id,
    createdAt,
    message: "Wiadomość została zapisana."
  });
});

app.get("/api/uat/overview", (_request, response) => {
  response.json({
    stats: {
      bookings: Number(countBookings.get()?.total || 0),
      contacts: Number(countContacts.get()?.total || 0),
      mailEvents: Number(countMailEvents.get()?.total || 0)
    },
    bookings: listRecentBookings.all(25),
    contacts: listRecentContacts.all(25),
    mailEvents: listRecentMailEvents.all(40)
  });
});

app.post("/api/uat/reset", (_request, response) => {
  db.exec(`
    DELETE FROM mail_events;
    DELETE FROM contacts;
    DELETE FROM bookings;
  `);

  response.json({
    ok: true,
    message: "Dane testowe zostały wyczyszczone."
  });
});

if (fs.existsSync(distDirectory)) {
  app.use(express.static(distDirectory));

  app.get("/{*path}", (request, response, next) => {
    if (request.path.startsWith("/api")) {
      return next();
    }

    return response.sendFile(path.join(distDirectory, "index.html"));
  });
}

app.use("/api", (_request, response) => {
  response.status(404).json({ message: "Nie znaleziono trasy API." });
});

app.listen(port, () => {
  console.log(`Satelle server running on http://localhost:${port}`);
});

function buildAvailability() {
  const days = [];
  const timeSlots = ["09:00", "11:30", "14:00", "16:30", "18:00"];
  const now = new Date();
  let dayOffset = 1;

  while (days.length < 8) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    dayOffset += 1;

    const weekday = date.getDay();

    if (weekday === 0 || weekday === 6) {
      continue;
    }

    const slots = timeSlots
      .map((time) => {
        const isoValue = toAppointmentIso(date, time);
        const bookingsCount = Number(countBookingsBySlot.get(isoValue)?.total || 0);

        return {
          value: isoValue,
          label: time,
          available: bookingsCount < 1
        };
      })
      .filter((slot) => slot.available);

    days.push({
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("pl-PL", {
        weekday: "short",
        month: "long",
        day: "numeric"
      }).format(date),
      slots
    });
  }

  return days;
}

function requireBasicAuth(request, response, next) {
  if (!basicAuthEnabled || request.path === "/api/health") {
    return next();
  }

  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Basic ")) {
    return challengeBasicAuth(response);
  }

  const encoded = authorization.slice(6);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return challengeBasicAuth(response);
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== basicAuthUser || password !== basicAuthPassword) {
    return challengeBasicAuth(response);
  }

  return next();
}

function challengeBasicAuth(response) {
  response.setHeader("WWW-Authenticate", 'Basic realm="Satelle UAT"');
  return response.status(401).send("Authentication required.");
}

function toAppointmentIso(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const appointment = new Date(date);

  appointment.setHours(hours, minutes, 0, 0);

  const timezoneOffset = -appointment.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(timezoneOffset);
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const offsetMinutes = String(absoluteOffset % 60).padStart(2, "0");

  return `${appointment.getFullYear()}-${String(appointment.getMonth() + 1).padStart(2, "0")}-${String(appointment.getDate()).padStart(2, "0")}T${String(appointment.getHours()).padStart(2, "0")}:${String(appointment.getMinutes()).padStart(2, "0")}:00${sign}${offsetHours}:${offsetMinutes}`;
}
