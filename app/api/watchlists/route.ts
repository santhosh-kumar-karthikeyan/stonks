import { NextResponse } from 'next/server';
import { getWatchlists, saveWatchlists } from '@/lib/watchlist-storage';

export async function GET() {
  try {
    const watchlists = await getWatchlists();
    return NextResponse.json(watchlists);
  } catch (error) {
    console.error('GET /api/watchlists failed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve watchlists', details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid request body: expected array of watchlists' },
        { status: 400 },
      );
    }

    await saveWatchlists(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/watchlists failed:', error);
    return NextResponse.json(
      { error: 'Failed to save watchlists', details: String(error) },
      { status: 500 },
    );
  }
}
