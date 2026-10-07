# SmartFind 校園教室智慧失物招領系統 (Campus AI Lost & Found)

> 🎓 **資訊管理學系 (MIS) 畢業專題 Prototype / Demo 系統**  
> 專為解決大學校園內「教室遺失物散落、公告不及時、Dcard 洗版」之痛點設計。

---

## 🌟 核心特色與亮點 (Highlights)

1. **拍照即辨識 (AI Vision Analysis)**：
   - 拍照上傳後，AI 自動辨識物品類別（3C周邊、證件、水壺、雨具、文具等）、外觀特徵與顏色，自動標籤。
   - **雙模運作機制**：預設啟用「內建智慧模擬引擎（免 API Key，完全離線/高可靠性）」，亦可填入 Google Gemini API Key 無縫升級為真實多模態視覺辨識。
2. **雙軌實體保管機制 (Dual-Track Custody)**：
   - 📦 **留置原教室講桌**：水壺、計算機、雨傘等一般物品，留在講桌讓失主直接返回教室拿取。
   - 🏢 **送至系辦／生輔組**：證件、耳機、錢包等貴重物品，標註保管處室與取件指引。
3. **教室空間結構化篩選 (Campus Classroom Filtering)**：
   - 支援依教學大樓（管理大樓、科技大樓、資訊大樓、圖書館等）、教室代號（M201、T304 等）、類別與狀態多維即時搜尋。
4. **防冒領驗證與狀態追蹤 (Anti-fraud & Status Lifecycle)**：
   - 狀態清楚流轉：`待認領 (Available)` $\rightarrow$ `已領回 (Claimed)`。
   - 支援拾獲者設定防冒領提問，失主回答後由系統記錄結案。
5. **展示專用輔助功能**：
   - 彈窗內附「快速示範照片一鍵帶入（AirPods、學生證、保溫杯、計算機）」，展示時無需花時間找照片。
   - 頂部導覽列提供「重設展示資料」按鈕，一鍵恢復為預設乾淨展示狀態。

---

## 🛠 技術堆疊 (Tech Stack)

- **前端與全端框架**：[Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **樣式與圖標**：[Tailwind CSS](https://tailwindcss.com/) v4 + [Lucide Icons](https://lucide.dev/)
- **資料儲存**：本機輕量結構化持久存儲 (`data/items.json`)
- **AI 模組**：Google Gemini 1.5/2.0 Flash 多模態 API + 內建智慧模擬降級引擎

---

## 🚀 啟動與執行方式 (Quick Start)

### 1. 安裝相依套件
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

瀏覽器打開：[http://localhost:3000](http://localhost:3000)

### 3. 編譯與正式建置測試
```bash
npm run build
```

---

## 📁 專案目錄結構

```text
e:\1007/
├── app/
│   ├── api/
│   │   ├── ai/vision/route.ts       # AI 多模態影像分析端點
│   │   ├── items/route.ts           # 物品列表查詢與新增
│   │   ├── items/[id]/claim/route.ts# 認領核銷流轉端點
│   │   └── items/reset/route.ts     # 一鍵重設展示資料
│   ├── components/
│   │   ├── Navbar.tsx               # 頂部導航與數據儀表板
│   │   ├── FilterBar.tsx            # 多維度篩選器 (大樓/教室/類別/保管)
│   │   ├── ItemCard.tsx             # 探索牆卡片元件
│   │   ├── UploadModal.tsx          # 拍照上傳精靈 (含雷達掃描與特徵萃取)
│   │   ├── ClaimModal.tsx           # 物品詳細與認領結案彈窗
│   │   └── SettingsModal.tsx        # AI 引擎切換與 API Key 設定
│   ├── globals.css                  # Tailwind 全域樣式
│   ├── layout.tsx                   # 根版面配置與 Meta 設定
│   └── page.tsx                     # 系統首頁入口
├── data/
│   └── items.json                   # 遺失物持久化資料庫
├── lib/
│   ├── types.ts                     # 核心資料型別定義
│   ├── db.ts                        # 資料庫讀寫與種子資料管理
│   └── ai-vision.ts                 # AI 影像辨識與智慧模擬核心引擎
└── package.json
```

---

## 🎯 專題評審與演示流程建議 (Demo Script)

1. **痛點介紹**：向教授說明大學教室經常遺失物品，現有校內系統老舊無人使用，學生在 Dcard 發文容易被洗版。
2. **探索牆展示**：展示大樓篩選（如切換到「管理大樓 M201」）與分類快速找回物品。
3. **通報展示**：
   - 點擊右上角「拍照通報拾獲」。
   - 點擊「快速示範照片：AirPods 耳機」。
   - 觀看 AI 影像動態雷射掃描，自動分析出「純白、Lightning、無保護套」等特徵標籤。
   - 選擇保管方式為「留置原教室講桌」，點擊送出立即置頂於動態牆。
4. **認領展示**：
   - 點擊剛才上傳的卡片，展示物品大圖與講桌領取指引。
   - 填寫認領人「資管二 11204012 王同學」，點擊「確認已取回」，狀態瞬間更新為「✅ 已領回結案」。
5. **技術架構亮點**：
   - 展示 Next.js 全端架構、自建智慧模擬引擎（容錯離線可用）與隨時可輸入 Gemini API Key 支援真 AI 多模態辨識。
