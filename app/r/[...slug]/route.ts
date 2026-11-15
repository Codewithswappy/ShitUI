import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const requested = slug?.join('/') || '';

  if (!requested) {
    const registryPath = path.join(REGISTRY_DIR, 'registry.json');
    if (fs.existsSync(registryPath)) {
      const data = fs.readFileSync(registryPath, 'utf-8');
      return new NextResponse(data, {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
    return NextResponse.json({ error: 'Registry not found' }, { status: 404, headers: CORS_HEADERS });
  }

  // Normalise requested name: remove trailing .json if present
  const baseName = requested.endsWith('.json') ? requested.slice(0, -5) : requested;

  // Potential file candidates
  const candidates = [
    `${baseName}.json`,
    `${requested}`,
    `${baseName.toLowerCase()}.json`,
  ];

  for (const candidate of candidates) {
    const candidatePath = path.join(REGISTRY_DIR, candidate);
    if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
      const data = fs.readFileSync(candidatePath, 'utf-8');
      return new NextResponse(data, {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
  }

  // Fallback: Case-insensitive scan in public/r
  try {
    if (fs.existsSync(REGISTRY_DIR)) {
      const allFiles = fs.readdirSync(REGISTRY_DIR);
      const lowerBase = baseName.toLowerCase();
      const match = allFiles.find((f) => {
        const withoutExt = f.replace(/\.json$/i, '').toLowerCase();
        return withoutExt === lowerBase || f.toLowerCase() === requested.toLowerCase();
      });

      if (match) {
        const matchPath = path.join(REGISTRY_DIR, match);
        const data = fs.readFileSync(matchPath, 'utf-8');
        return new NextResponse(data, {
          status: 200,
          headers: CORS_HEADERS,
        });
      }
    }
  } catch (err) {
    console.error('Error reading registry directory:', err);
  }

  return NextResponse.json(
    {
      error: `Component "${requested}" not found in ShitUI registry.`,
      availableRegistry: 'https://shitui.in/r/registry.json',
    },
    {
      status: 404,
      headers: CORS_HEADERS,
    }
  );
}
