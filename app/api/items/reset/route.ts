import { NextResponse } from 'next/server';
import { resetToSeedData } from '@/lib/db';

export async function POST() {
  try {
    const items = await resetToSeedData();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to reset items:', error);
    return NextResponse.json({ success: false, error: '重設資料失敗' }, { status: 500 });
  }
}
