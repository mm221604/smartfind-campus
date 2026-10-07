import fs from 'fs';
import path from 'path';
import { LostItem } from './types';
import { neon } from '@neondatabase/serverless';

const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'items.json')
  : path.join(process.cwd(), 'data', 'items.json');

// 雲端無伺服器環境記憶體備援快取
let inMemoryCache: LostItem[] | null = null;

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
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 2800).toISOString(),
    finderName: '圖書館工讀生',
    claimedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    claimedBy: '資工系 11204012 王同學',
    claimNotes: '失主出示購買發票與傘柄刻痕核對無誤，已取回。',
  },
];

// 取得資料庫連線字串（Vercel Postgres / Neon）
function getPostgresUrl(): string | null {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || null;
}

let isPostgresInitialized = false;

// 自動建立 PostgreSQL 資料表並匯入種子資料
async function initPostgresTable(sql: any) {
  if (isPostgresInitialized) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS lost_items (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        building VARCHAR(100) NOT NULL,
        classroom VARCHAR(100) NOT NULL,
        custody_type VARCHAR(50) NOT NULL,
        custody_detail TEXT NOT NULL,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        color VARCHAR(100),
        ai_confidence INT,
        ai_engine VARCHAR(50),
        status VARCHAR(50) NOT NULL,
        created_at TEXT NOT NULL,
        finder_name VARCHAR(100) NOT NULL,
        claimed_at TEXT,
        claimed_by VARCHAR(100),
        claim_notes TEXT,
        security_question TEXT
      );
    `;

    // 檢查資料表中是否已有資料
    const countRes = await sql`SELECT count(*) as count FROM lost_items;`;
    const count = parseInt(countRes[0]?.count || '0', 10);

    if (count === 0) {
      console.log('Seeding initial items to PostgreSQL...');
      for (const item of INITIAL_SEED_ITEMS) {
        await sql`
          INSERT INTO lost_items (
            id, title, category, image_url, building, classroom,
            custody_type, custody_detail, features, color,
            ai_confidence, ai_engine, status, created_at,
            finder_name, claimed_at, claimed_by, claim_notes, security_question
          ) VALUES (
            ${item.id}, ${item.title}, ${item.category}, ${item.imageUrl}, ${item.building}, ${item.classroom},
            ${item.custodyType}, ${item.custodyDetail}, ${JSON.stringify(item.features)}, ${item.color},
            ${item.aiConfidence}, ${item.aiEngine}, ${item.status}, ${item.createdAt},
            ${item.finderName}, ${item.claimedAt || null}, ${item.claimedBy || null}, ${item.claimNotes || null}, ${item.securityQuestion || null}
          );
        `;
      }
    }
    isPostgresInitialized = true;
  } catch (err) {
    console.error('Failed to initialize PostgreSQL table:', err);
  }
}

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 取得所有失物
export async function getAllItems(): Promise<LostItem[]> {
  const pgUrl = getPostgresUrl();

  // 1. 若有 Vercel Postgres / Neon 連線字串，使用雲端資料庫
  if (pgUrl) {
    try {
      const sql = neon(pgUrl);
      await initPostgresTable(sql);

      const rows = await sql`
        SELECT * FROM lost_items ORDER BY created_at DESC;
      `;

      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        imageUrl: r.image_url,
        building: r.building,
        classroom: r.classroom,
        custodyType: r.custody_type,
        custodyDetail: r.custody_detail,
        features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features) : []),
        color: r.color,
        aiConfidence: r.ai_confidence,
        aiEngine: r.ai_engine,
        status: r.status,
        createdAt: r.created_at,
        finderName: r.finder_name,
        claimedAt: r.claimed_at,
        claimedBy: r.claimed_by,
        claimNotes: r.claim_notes,
        securityQuestion: r.security_question,
      })) as LostItem[];
    } catch (err) {
      console.warn('PostgreSQL query failed, falling back to local memory:', err);
    }
  }

  // 2. 本機或無連線字串時的備援模式 (Local File / In-memory)
  if (inMemoryCache) {
    return inMemoryCache;
  }

  ensureDbDirectory();
  try {
    if (!fs.existsSync(DB_FILE)) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_ITEMS, null, 2), 'utf-8');
      } catch (err) {
        console.warn('Cannot write initial DB_FILE to disk, using inMemoryCache:', err);
      }
      inMemoryCache = [...INITIAL_SEED_ITEMS];
      return inMemoryCache;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryCache = JSON.parse(raw) as LostItem[];
    return inMemoryCache;
  } catch (error) {
    console.warn('Error reading items db, falling back to seed:', error);
    inMemoryCache = [...INITIAL_SEED_ITEMS];
    return inMemoryCache;
  }
}

// 新增遺失物
export async function addItem(item: LostItem): Promise<LostItem> {
  const pgUrl = getPostgresUrl();

  if (pgUrl) {
    try {
      const sql = neon(pgUrl);
      await initPostgresTable(sql);

      await sql`
        INSERT INTO lost_items (
          id, title, category, image_url, building, classroom,
          custody_type, custody_detail, features, color,
          ai_confidence, ai_engine, status, created_at,
          finder_name, claimed_at, claimed_by, claim_notes, security_question
        ) VALUES (
          ${item.id}, ${item.title}, ${item.category}, ${item.imageUrl}, ${item.building}, ${item.classroom},
          ${item.custodyType}, ${item.custodyDetail}, ${JSON.stringify(item.features)}, ${item.color},
          ${item.aiConfidence}, ${item.aiEngine}, ${item.status}, ${item.createdAt},
          ${item.finderName}, ${item.claimedAt || null}, ${item.claimedBy || null}, ${item.claimNotes || null}, ${item.securityQuestion || null}
        );
      `;

      return item;
    } catch (err) {
      console.error('Failed to insert into PostgreSQL, falling back to local:', err);
    }
  }

  const items = await getAllItems();
  items.unshift(item);
  inMemoryCache = items;

  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk in serverless environment:', err);
  }
  return item;
}

// 認領物品狀態更新
export async function claimItem(id: string, claimedBy: string, claimNotes?: string): Promise<LostItem | null> {
  const pgUrl = getPostgresUrl();
  const claimedAt = new Date().toISOString();
  const finalNotes = claimNotes || '現場核對特徵吻合，已完成認領。';

  if (pgUrl) {
    try {
      const sql = neon(pgUrl);
      await initPostgresTable(sql);

      const res = await sql`
        UPDATE lost_items
        SET status = 'claimed',
            claimed_at = ${claimedAt},
            claimed_by = ${claimedBy},
            claim_notes = ${finalNotes}
        WHERE id = ${id}
        RETURNING *;
      `;

      if (res.length > 0) {
        const r = res[0];
        return {
          id: r.id,
          title: r.title,
          category: r.category,
          imageUrl: r.image_url,
          building: r.building,
          classroom: r.classroom,
          custodyType: r.custody_type,
          custodyDetail: r.custody_detail,
          features: Array.isArray(r.features) ? r.features : (typeof r.features === 'string' ? JSON.parse(r.features) : []),
          color: r.color,
          aiConfidence: r.ai_confidence,
          aiEngine: r.ai_engine,
          status: r.status,
          createdAt: r.created_at,
          finderName: r.finder_name,
          claimedAt: r.claimed_at,
          claimedBy: r.claimed_by,
          claimNotes: r.claim_notes,
          securityQuestion: r.security_question,
        } as LostItem;
      }
    } catch (err) {
      console.error('Failed to update in PostgreSQL, falling back to local:', err);
    }
  }

  const items = await getAllItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    status: 'claimed',
    claimedAt,
    claimedBy,
    claimNotes: finalNotes,
  };

  inMemoryCache = items;
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk in serverless environment:', err);
  }

  return items[index];
}

// 重設回種子資料
export async function resetToSeedData(): Promise<LostItem[]> {
  const pgUrl = getPostgresUrl();

  if (pgUrl) {
    try {
      const sql = neon(pgUrl);
      isPostgresInitialized = false;

      await sql`DROP TABLE IF EXISTS lost_items;`;
      await initPostgresTable(sql);

      return await getAllItems();
    } catch (err) {
      console.error('Failed to reset PostgreSQL, falling back to local:', err);
    }
  }

  inMemoryCache = [...INITIAL_SEED_ITEMS];
  try {
    ensureDbDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_ITEMS, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk during reset:', err);
  }
  return inMemoryCache;
}
