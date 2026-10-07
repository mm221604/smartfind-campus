import { NextResponse } from 'next/server';
import { getAllItems, addItem } from '@/lib/db';
import { LostItem } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '全部';
    const building = searchParams.get('building') || '全部';
    const status = searchParams.get('status') || '全部';
    const custodyType = searchParams.get('custodyType') || '全部';

    let items = await getAllItems();

    if (search) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.classroom.toLowerCase().includes(search) ||
          item.building.toLowerCase().includes(search) ||
          item.features.some((f) => f.toLowerCase().includes(search))
      );
    }

    if (category && category !== '全部') {
      items = items.filter((item) => item.category === category);
    }

    if (building && building !== '全部') {
      items = items.filter((item) => item.building.includes(building));
    }

    if (status && status !== '全部') {
      items = items.filter((item) => item.status === status);
    }

    if (custodyType && custodyType !== '全部') {
      items = items.filter((item) => item.custodyType === custodyType);
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Failed to get items:', error);
    return NextResponse.json({ success: false, error: '取得遺失物資料失敗' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newItem: LostItem = {
      id: `item-${Date.now()}`,
      title: body.title || '未命名遺失物',
      category: body.category || '生活雜物',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800',
      building: body.building || '管理大樓 (M棟)',
      classroom: body.classroom || '一般教室',
      custodyType: body.custodyType || 'podium',
      custodyDetail: body.custodyDetail || '留置於講桌上',
      features: Array.isArray(body.features) ? body.features : ['AI 辨識'],
      color: body.color || '其他',
      aiConfidence: body.aiConfidence || 95,
      aiEngine: body.aiEngine || 'smart-mock',
      status: 'available',
      createdAt: new Date().toISOString(),
      finderName: body.finderName || '好心同學',
      securityQuestion: body.securityQuestion || '',
    };

    const saved = await addItem(newItem);
    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json({ success: false, error: '新增遺失物失敗' }, { status: 500 });
  }
}
