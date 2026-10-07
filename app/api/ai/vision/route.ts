import { NextResponse } from 'next/server';
import { analyzeItemImage } from '@/lib/ai-vision';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, fileName, apiKey } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: '請提供欲辨識之圖片' },
        { status: 400 }
      );
    }

    const result = await analyzeItemImage({
      imageBase64,
      fileName,
      apiKey,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('AI vision analysis failed:', error);
    return NextResponse.json(
      { success: false, error: 'AI 影像分析發生錯誤' },
      { status: 500 }
    );
  }
}
