import fs from 'fs';
import path from 'path';
import { LostItem } from './types';

const DB_FILE = path.join(process.cwd(), 'data', 'items.json');

// 預設擬真校園教室遺失物種子資料
const INITIAL_SEED_ITEMS: LostItem[] = [
  {
    id: 'item-001',
    title: 'Apple AirPods Pro 2 充電盒',
    category: '3C周邊',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    building: '管理大樓 (M棟)',
    classroom: 'M201 智慧階梯教室',
    custodyType: 'podium',
    custodyDetail: '留在 M201 講桌右側麥克風與投影機控制台旁',
    features: ['白色外殼', 'Lightning 接孔', '背面微小刮痕', '無保護套'],
    color: '純白',
    aiConfidence: 97,
    aiEngine: 'smart-mock',
    status: 'available',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 分鐘前
    finderName: '好心資管二 陳同學',
    securityQuestion: '充電盒開蓋後內部耳機序號末兩碼，或是否包含雙耳？',
  },
  {
    id: 'item-002',
    title: '學生證 (資訊管理系 學士班)',
    category: '證件票卡',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    building: '資訊大樓 (I棟)',
    classroom: 'I102 大數據電腦教室',
    custodyType: 'office',
    custodyDetail: '已送交管理大樓 3F 資管系系辦公室櫃台助教保管',
    features: ['悠遊卡學生證', '資管系專用藍色卡套', '姓名林**', '學號開頭 111'],
    color: '藍色卡套 / 白卡',
    aiConfidence: 99,
    aiEngine: 'smart-mock',
    status: 'available',
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(), // 2 小時前
    finderName: '資管大四 林同學',
    securityQuestion: '請出示身分證件或核對完整學號',
  },
  {
    id: 'item-003',
    title: '象印 500ml 霧黑不鏽鋼保溫水壺',
    category: '保溫瓶水壺',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    building: '科技大樓 (T棟)',
    classroom: 'T304 軟體工程實驗室',
    custodyType: 'podium',
    custodyDetail: '留在 T304 靠窗第三排桌上，無人移動',
    features: ['黑色霧面', '彈蓋式設計', '瓶身有登山貼紙', '500ml'],
    color: '霧黑',
    aiConfidence: 94,
    aiEngine: 'smart-mock',
    status: 'available',
    createdAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(), // 4.5 小時前
    finderName: '助教 張學長',
  },
  {
    id: 'item-004',
    title: 'Casio fx-991ES PLUS 工程計算機',
    category: '書注文具',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
    building: '管理大樓 (M棟)',
    classroom: 'M302 統計學專用教室',
    custodyType: 'podium',
    custodyDetail: '統計學期中考後遺留在講桌正中央',
    features: ['銀灰硬蓋', '雙電源太陽能', '背蓋貼有統計公式小抄標籤'],
    color: '銀黑色',
    aiConfidence: 95,
    aiEngine: 'smart-mock',
    status: 'available',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 小時前
    finderName: '修統計課的同學',
  },
  {
    id: 'item-005',
    title: 'iPad 巧控鍵盤 (適用 11 吋 iPad Pro)',
    category: '3C周邊',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    building: '管理大樓 (M棟)',
    classroom: 'M405 專題研討室',
    custodyType: 'office',
    custodyDetail: '貴重物品，已送交行政大樓 1F 學生事務處生輔組登記入庫',
    features: ['黑色鍵盤保護蓋', '磁吸接點乾淨', '右下角有輕微摩擦痕跡'],
    color: '消光黑',
    aiConfidence: 98,
    aiEngine: 'smart-mock',
    status: 'available',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 天前
    finderName: '企管所 研討生',
    securityQuestion: '鍵盤背後的 Apple Logo 旁是否有其他刻字或裝飾貼紙？',
  },
  {
    id: 'item-006',
    title: '極簡深藍自動防風摺疊傘',
    category: '雨具衣物',
    imageUrl: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80',
    building: '總圖書館 (LIB)',
    classroom: '1F 自習室走廊傘架',
    custodyType: 'office',
    custodyDetail: '原本置於圖書館門口傘架，已由失主出示照片核對領回',
    features: ['深藍色傘面', '木質手柄', '十骨防風骨架'],
    color: '深藍色',
    aiConfidence: 92,
    aiEngine: 'smart-mock',
    status: 'claimed',
    createdAt: new Date(Date.now() - 1000 * 60 * 2800).toISOString(), // 2 天前
    finderName: '圖書館工讀生',
    claimedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    claimedBy: '資工系 11204012 王同學',
    claimNotes: '失主出示購買發票與傘柄刻痕核對無誤，已取回。',
  },
];

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getAllItems(): LostItem[] {
  ensureDbDirectory();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_ITEMS, null, 2), 'utf-8');
    return INITIAL_SEED_ITEMS;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as LostItem[];
  } catch (error) {
    console.error('Error reading items db, resetting to seed:', error);
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_ITEMS, null, 2), 'utf-8');
    return INITIAL_SEED_ITEMS;
  }
}

export function saveItems(items: LostItem[]): void {
  ensureDbDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

export function addItem(item: LostItem): LostItem {
  const items = getAllItems();
  items.unshift(item); // 最新放在最前面
  saveItems(items);
  return item;
}

export function claimItem(id: string, claimedBy: string, claimNotes?: string): LostItem | null {
  const items = getAllItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    status: 'claimed',
    claimedAt: new Date().toISOString(),
    claimedBy,
    claimNotes: claimNotes || '現場核對特徵吻合，已完成認領。',
  };

  saveItems(items);
  return items[index];
}

export function resetToSeedData(): LostItem[] {
  ensureDbDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_ITEMS, null, 2), 'utf-8');
  return INITIAL_SEED_ITEMS;
}
