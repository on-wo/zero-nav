import { NextRequest, NextResponse } from 'next/server';
import { getSiteData } from '@/lib/kv';

export async function GET(request: NextRequest) {
  try {
    // @ts-ignore - Cloudflare Workers env
    const kv = request.nextUrl.searchParams.get('env')?.BOOKMARKS_KV || process.env.BOOKMARKS_KV;

    if (!kv) {
      // For development, return mock data
      return NextResponse.json({
        version: 1,
        updatedAt: new Date().toISOString(),
        bookmarks: [],
        meta: {
          customElements: {
            headerText: '在线服务',
            footerText: 'Powered by zero-nav-next',
          },
        },
      });
    }

    const data = await getSiteData(kv as KVNamespace);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}
