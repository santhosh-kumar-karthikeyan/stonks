import fs from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';

const WATCHLIST_PATH = path.join(process.cwd(), 'data/raw/watchlist.json');

export async function GET() {
  const data = await fs.readFile(WATCHLIST_PATH, 'utf-8');
  return Response.json(JSON.parse(data));
}

export async function POST(request: NextRequest) {
  try {
    const watchlists = await request.json();
    console.log(
      '📝 Writing watchlists to file:',
      watchlists.length,
      'watchlists',
    );
    await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
    console.log('✅ Successfully wrote watchlists to file');
    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to write watchlists:', error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
