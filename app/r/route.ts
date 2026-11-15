import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = path.join(process.cwd(), 'public/r');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  const registryPath = path.join(REGISTRY_DIR, 'registry.json');
  if (fs.existsSync(registryPath)) {
    const data = fs.readFileSync(registryPath, 'utf-8');
    return new NextResponse(data, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }
  return NextResponse.json({ error: 'Registry index not found' }, { status: 404, headers: CORS_HEADERS });
}
