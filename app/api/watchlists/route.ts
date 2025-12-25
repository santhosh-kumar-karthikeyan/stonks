import fs from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';

const WATCHLIST_PATH = path.join(process.cwd(), 'data/raw/watchlist.json');

export async function GET() {
  const data = await fs.readFile(WATCHLIST_PATH, 'utf-8');
  return Response.json(JSON.parse(data));
}

export async function POST(request: NextRequest) {
  const watchlists = await request.json();
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
  return Response.json({ success: true });
}
