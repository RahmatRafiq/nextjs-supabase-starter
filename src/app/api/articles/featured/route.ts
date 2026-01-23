import { NextResponse } from 'next/server';
import { RepositoryFactory } from '@/infrastructure/repositories/RepositoryFactory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repo = RepositoryFactory.getArticleRepository();
    const articles = await repo.getFeatured(3);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured articles' },
      { status: 500 }
    );
  }
}
