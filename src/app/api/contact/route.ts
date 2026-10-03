import { NextResponse } from 'next/server';

// Stub: validates input only. Wire to an email provider before relying on it.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string; email?: string; message?: string } | null;
  if (!body?.name || !body.email || !body.message || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ error: 'name, valid email and message are required' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
