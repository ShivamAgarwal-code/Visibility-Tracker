import express from "express";
import cors from "cors";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DB_URL || "postgres://postgres:labdhi@localhost:5432/AI-Search",
});

const JWT_SECRET = 'your_jwt_secret'; // Use env variable in production

// Function to reset queries for all users
async function resetQueries() {
  try {
    const maxQueries = 25; // Max queries per user
    await pool.query(
      `UPDATE user_queries SET queries_left = $1, last_reset_at = NOW()`,
      [maxQueries]
    );
    console.log("[CRON] Successfully reset queries for all users at", new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  } catch (err) {
    console.error("[CRON] Error resetting queries:", err);
  }
}

// // Schedule jobs exactly at 9AM, 1PM, 7PM IST 
// const timesIST = [9, 13, 19]; 

// timesIST.forEach(hour => {
//   const baseMinute = 0; // Exact time at minute 0
//   const minute = baseMinute; // No randomization here
//   // Convert IST (UTC+5:30) to UTC
//   let utcHour = hour - 5;
//   let utcMinute = minute - 30;
//   if (utcMinute < 0) {
//     utcMinute += 60;
//     utcHour -= 1;
//   }
//   if (utcHour < 0) utcHour += 24;
//   const cronTime = `${utcMinute} ${utcHour} * * *`;
//   cron.schedule(cronTime, () => resetQueries(), { timezone: "UTC" });
//   console.log(`[CRON] Scheduled reset at IST ${hour}:${baseMinute < 10 ? '0' : ''}${baseMinute}, UTC ${utcHour}:${utcMinute < 10 ? '0' : ''}${utcMinute}`);
// });

app.post('/api/login', async (req, res) => {
  const { pEmail, pPassword } = req.body;
  try {
    const result = await pool.query('SELECT id, email, password, name FROM users WHERE email = $1', [pEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    // In production, use bcrypt.compare(pPassword, user.password)
    if (user.password !== pPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({
      loginResponse: {
        jwtToken: token,
        userRow: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
