import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL 
});

const JWT_SECRET = 'your_jwt_secret'; // Use env variable in production

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pEmail, pPassword } = body || {};

    if (!pEmail || !pPassword) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const result = await pool.query('SELECT "id", "email", "username" FROM "user" WHERE "email" = $1 AND "password" = crypt($2, "password")', [pEmail, pPassword]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({
      loginResponse: {
        jwtToken: token,
        userRow: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
    });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
