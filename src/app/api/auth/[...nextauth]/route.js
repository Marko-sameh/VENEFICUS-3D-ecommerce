// NextAuth.js has been removed from this project
// Authentication is now handled directly with @react-oauth/google
// This file is kept to prevent 404 errors but returns a 404 response

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'NextAuth.js has been removed. Use Google OAuth directly.' },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'NextAuth.js has been removed. Use Google OAuth directly.' },
    { status: 404 }
  );
}