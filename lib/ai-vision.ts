import { ItemCategory, VisionAnalysisResult, CustodyType } from './types';

interface VisionRequest {
  imageBase64: string; // data:image/...;base64,... or pure base64
  fileName?: string;
  apiKey?: string;
}

const SMART_MOCK_PRESETS: VisionAnalysisResult[] = [
  {
    title: 'Apple AirPods 藍牙耳機保護盒',
    category: '3C周邊',
    color: '白色',
    features: ['磁吸充電盒', '充電孔 Lightning', '外殼略有細微使用痕跡', '無外加保護套'],
    suggestedCustodyType: 'podium',
    confidence: 96,
    engine: 'smart-mock',
    description: '白色 Apple AirPods 耳機盒，疑似下課匆忙遺留在座位或講桌上。',
  },
  {
    title: '象印 / 膳魔師 不鏽鋼霧面保溫水壺',
    category: '保溫瓶水壺',
    color: '霧黑色',
    features: ['彈蓋安全鎖', '瓶身容量約 500ml', '底部有防滑矽膠圈', '無刮痕'],
    suggestedCustodyType: 'podium',
    confidence: 94,
    engine: 'smart-mock',
    description: '霧黑質感保溫水壺，保溫效果良好，外觀保持極新。',
  },
  {
    title: '國立大學數位學生證 / 悠遊卡',
    category: '證件票卡',
    color: '白藍配色',
    features: ['學生身分證件', '悠遊卡晶片感應面', '背面有學號與系所條碼', '證件套附頸繩'],
    suggestedCustodyType: 'office',
    confidence: 98,
    engine: 'smart-mock',
    description: '重要個人身分與門禁證件，建議優先送交系辦公室或生輔組保管以策安全。',
  },
  {
    title: 'Casio 多功能工程型計算機',
    category: '書注文具',
    color: '銀黑色',
    features: ['雙行顯示幕', '滑蓋式硬保護殼', '太陽能與電池雙重電力', '適合商管或工程考科'],
    suggestedCustodyType: 'podium',
    confidence: 93,
    engine: 'smart-mock',
    description: '商管與統計課程必備工程計算機，考試或演習課常遺留在講桌周遭。',
  },
  {
    title: '極簡十骨黑膠自動防風摺疊傘',
    category: '雨具衣物',
    color: '深藍色',
    features: ['一鍵自動開收按鈕', '防潑水傘布', '內層黑膠抗 UV', '傘柄附掛繩'],
    suggestedCustodyType: 'podium',
    confidence: 91,
    engine: 'smart-mock',
    description: '深色折疊雨傘，教室下課時容易遺忘在走廊或座位旁掛勾。',
  },
  {
    title: 'Logitech 靜音無線辦公滑鼠',
    category: '3C周邊',
    color: '石墨黑',
    features: ['人體工學側握', '底部帶有開關與藍牙配對鈕', '滾輪順暢', '無接收器'],
    suggestedCustodyType: 'podium',
    confidence: 95,
    engine: 'smart-mock',
    description: '無線藍牙滑鼠，通常在電腦教室或筆電課堂結束後遺留在桌上。',
  },
];

export async function analyzeItemImage({
  imageBase64,
  fileName,
  apiKey,
}: VisionRequest): Promise<VisionAnalysisResult> {
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // 1. 若有提供 Gemini API Key，嘗試呼叫真實 Gemini 1.5 Flash 多模態 API
  if (effectiveApiKey && effectiveApiKey.trim() !== '') {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      const mimeTypeMatch = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      const prompt = `你是一個大學校園「教室遺失物智慧招領系統」的 AI 視覺分析專家。
請仔細辨識這張圖片中的物品，並以純 JSON 格式輸出以下欄位（不要包含額外的 Markdown 標記或 \`\`\`json 之外的文字）：
{
  "title": "物品繁體中文名稱 (例如：Apple AirPods Pro 藍牙耳機、象印霧黑保溫水壺)",
  "category": "3C周邊" 或 "證件票卡" 或 "保溫瓶水壺" 或 "雨具衣物" 或 "書注文具" 或 "生活雜物",
  "color": "主要顏色 (例如：純白色、深藍色)",
  "features": ["外觀特徵標籤1", "特徵2", "特徵3", "特徵4"],
  "suggestedCustodyType": "podium" (若是雨傘、水壺、筆記本等可放講桌) 或 "office" (若是錢包、手機、學生證、iPad等貴重物品建議送系辦或生輔組),
  "confidence": 95,
  "description": "約20-40字的物品外觀與狀態簡短描述"
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: cleanBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.2,
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            title: parsed.title || '校園教室遺失物',
            category: (parsed.category as ItemCategory) || '生活雜物',
            color: parsed.color || '不詳',
            features: Array.isArray(parsed.features) ? parsed.features : ['AI 辨識特徵'],
            suggestedCustodyType: (parsed.suggestedCustodyType as CustodyType) || 'podium',
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 95,
            engine: 'gemini',
            description: parsed.description || 'AI 已成功擷取該物品影像特徵。',
          };
        }
      } else {
        console.warn('Gemini API returned non-OK status, falling back to Smart Mock:', res.status);
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Smart Mock:', err);
    }
  }

  // 2. 智慧模擬模式 (Smart Mock Engine)：根據檔名關鍵字或預設庫匹配
  const lowerName = (fileName || '').toLowerCase();

  if (lowerName.includes('airpod') || lowerName.includes('ear') || lowerName.includes('耳機')) {
    return { ...SMART_MOCK_PRESETS[0], engine: 'smart-mock' };
  }
  if (lowerName.includes('bottle') || lowerName.includes('water') || lowerName.includes('水壺') || lowerName.includes('杯')) {
    return { ...SMART_MOCK_PRESETS[1], engine: 'smart-mock' };
  }
  if (lowerName.includes('card') || lowerName.includes('id') || lowerName.includes('證') || lowerName.includes('卡')) {
    return { ...SMART_MOCK_PRESETS[2], engine: 'smart-mock' };
  }
  if (lowerName.includes('calc') || lowerName.includes('計') || lowerName.includes('book') || lowerName.includes('書')) {
    return { ...SMART_MOCK_PRESETS[3], engine: 'smart-mock' };
  }
  if (lowerName.includes('umbrella') || lowerName.includes('傘')) {
    return { ...SMART_MOCK_PRESETS[4], engine: 'smart-mock' };
  }
  if (lowerName.includes('mouse') || lowerName.includes('滑鼠')) {
    return { ...SMART_MOCK_PRESETS[5], engine: 'smart-mock' };
  }

  // 隨機選一個擬真物品並微調信心度，模擬神經網路多模態推論
  const randomPreset = SMART_MOCK_PRESETS[Math.floor(Math.random() * SMART_MOCK_PRESETS.length)];
  const randomConfidence = Math.floor(Math.random() * 6) + 93; // 93% ~ 98%
  return {
    ...randomPreset,
    confidence: randomConfidence,
    engine: 'smart-mock',
  };
}
