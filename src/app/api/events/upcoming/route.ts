import { NextResponse } from 'next/server';
import { RepositoryFactory } from '@/infrastructure/repositories/RepositoryFactory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repo = RepositoryFactory.getEventRepository();
    const events = await repo.getUpcoming(3);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
