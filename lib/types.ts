export type ItemCategory = 
  | '3C周邊'
  | '證件票卡'
  | '保溫瓶水壺'
  | '雨具衣物'
  | '書注文具'
  | '生活雜物';

export type CustodyType = 'podium' | 'office'; // podium = 留在原教室講桌, office = 已送至系辦/警衛室

export type ItemStatus = 'available' | 'claimed'; // available = 待認領, claimed = 已領回

export type CampusTheme = 'tech-blue' | 'crimson-red' | 'emerald-green';

export interface LostItem {
  id: string;
  title: string;
  category: ItemCategory;
  imageUrl: string;
  building: string;
  classroom: string;
  custodyType: CustodyType;
  custodyDetail: string; // 具體位置說明（例如：M201 講桌麥克風旁、資管系系辦 3F 櫃台）
  features: string[]; // AI 辨識出的外觀特徵標籤
  color: string;
  aiConfidence: number; // 辨識信心度 0-100
  aiEngine: 'gemini' | 'smart-mock';
  status: ItemStatus;
  createdAt: string; // ISO 日期字串
  finderName: string; // 拾獲者（例如：資管二 小明）
  claimedAt?: string;
  claimedBy?: string; // 認領人學號/姓名
  claimNotes?: string; // 認領核對紀錄
  securityQuestion?: string; // 防冒領問題
}

export interface VisionAnalysisResult {
  title: string;
  category: ItemCategory;
  color: string;
  features: string[];
  suggestedCustodyType: CustodyType;
  confidence: number;
  engine: 'gemini' | 'smart-mock';
  description: string;
}
