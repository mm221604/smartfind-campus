import { NextResponse } from 'next/server';
import { claimItem } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { claimedBy, claimNotes } = body;

    if (!claimedBy || claimedBy.trim() === '') {
      return NextResponse.json(
        { success: false, error: '請提供認領人姓名或學號' },
        { status: 400 }
      );
    }

    const updated = claimItem(id, claimedBy, claimNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: '找不到該筆遺失物' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Failed to claim item:', error);
    return NextResponse.json({ success: false, error: '認領處理失敗' }, { status: 500 });
  }
}
