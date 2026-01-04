import { NextResponse } from 'next/server';
import { jsonProductRepository } from '@/infrastructure/repositories/JsonProductRepository';

export async function GET() {
  try {
    const products = await jsonProductRepository.findAll();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
