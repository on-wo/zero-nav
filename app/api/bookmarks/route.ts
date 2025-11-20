import { NextRequest, NextResponse } from 'next/server';
import { getConfig, setConfig } from '@/lib/kv';
import type { NavConfig } from '@/lib/types';

export async function GET() {
  try {
    const config = await getConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const config: NavConfig = await request.json();
    await setConfig(config);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bookmarks' },
      { status: 500 }
    );
  }
}
