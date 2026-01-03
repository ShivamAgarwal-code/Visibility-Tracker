import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT user_id, queries_left FROM public.user_queries ORDER BY user_id ASC');
    client.release();
    return NextResponse.json({ users: result.rows });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const client = await pool.connect();
    // Decrement queries_left for the user
    const updateResult = await client.query(
      'UPDATE public.user_queries SET queries_left = queries_left - 1 WHERE user_id = $1 AND queries_left > 0 RETURNING queries_left',
      [userId]
    );
    client.release();
    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'No queries left or user not found' }, { status: 400 });
    }
    return NextResponse.json({ queries_left: updateResult.rows[0].queries_left });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: 'Database error', details: err.message }, { status: 500 });
  }
}