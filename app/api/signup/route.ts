import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, username, firstname, lastname, password } = await req.json();
    if (!email || !username || !firstname || !lastname || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    // Check if user already exists
    const exists = await pool.query('SELECT 1 FROM "user" WHERE "email" = $1 OR "username" = $2', [email, username]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'User with this email or username already exists.' }, { status: 409 });
    }
    // Insert new user with hashed password
    await pool.query(
      'INSERT INTO "user" ("email", "username", "firstname", "lastname", "password") VALUES ($1, $2, $3, $4, crypt($5, gen_salt(\'bf\')))',
      [email, username, firstname, lastname, password]
    );
    return NextResponse.json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
