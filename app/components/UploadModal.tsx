'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles, Check, AlertCircle, Building, Package, ShieldCheck, RefreshCw } from 'lucide-react';
import { ItemCategory, CustodyType, VisionAnalysisResult } from '@/lib/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: () => void;
  apiKey: string;
}

// 快速展示測試照片範例（方便免手動找圖片直接體驗）
const PRESET_DEMO_IMAGES = [
  {
    name: 'AirPods 耳機',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    title: 'Apple AirPods 藍牙耳機',
    fileName: 'airpods_white.jpg',
  },
  {
    name: '學生證卡套',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
    title: '學生證 / 門禁悠遊卡',
    fileName: 'student_id_card.jpg',
  },
  {
    name: '保溫水壺',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    title: '象印不鏽鋼保溫水壺',
    fileName: 'water_bottle_black.jpg',
  },
  {
    name: '工程計算機',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
    title: 'Casio 工程計算機',
    fileName: 'calculator_casio.jpg',
  },
];

const CATEGORIES: ItemCategory[] = [
  '3C周邊',
  '證件票卡',
  '保溫瓶水壺',
  '雨具衣物',
  '書注文具',
  '生活雜物',
];

const BUILDINGS = [
  '管理大樓 (M棟)',
  '資訊大樓 (I棟)',
  '科技大樓 (T棟)',
  '總圖書館 (LIB)',
  '學生活動中心',
];

export default function UploadModal({
  isOpen,
  onClose,
  onItemCreated,
  apiKey,
}: UploadModalProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 表單資料狀態
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('3C周邊');
  const [color, setColor] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [building, setBuilding] = useState('管理大樓 (M棟)');
  const [classroom, setClassroom] = useState('M201');
  const [custodyType, setCustodyType] = useState<CustodyType>('podium');
  const [custodyDetail, setCustodyDetail] = useState('放置於講桌中央麥克風旁');
  const [finderName, setFinderName] = useState('好心資管二同學');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [aiConfidence, setAiConfidence] = useState(96);
  const [aiEngine, setAiEngine] = useState<'gemini' | 'smart-mock'>('smart-mock');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 執行 AI 辨識分析
  const triggerAiAnalysis = async (base64OrUrl: string, name: string) => {
    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64OrUrl,
          fileName: name,
          apiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        const result: VisionAnalysisResult = data.result;
        setTitle(result.title);
        setCategory(result.category);
        setColor(result.color);
        setFeatures(result.features || []);
        setAiConfidence(result.confidence);
        setAiEngine(result.engine);
        setCustodyType(result.suggestedCustodyType);
        if (result.suggestedCustodyType === 'podium') {
          setCustodyDetail(`留置於 ${classroom} 講桌上`);
        } else {
          setCustodyDetail('已送至管理大樓 3F 資管系辦公室櫃台');
        }
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      setErrorMsg('AI 辨識服務暫時無法回應，已啟用備用填寫模式。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 處理本機檔案選取
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      triggerAiAnalysis(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  // 選取快速範例照片
  const handleSelectPreset = (preset: (typeof PRESET_DEMO_IMAGES)[0]) => {
    setImagePreview(preset.url);
    setFileName(preset.fileName);
    triggerAiAnalysis(preset.url, preset.fileName);
  };

  // 移除或新增標籤
  const handleRemoveTag = (tagToRemove: string) => {
    setFeatures(features.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !features.includes(newTag.trim())) {
      setFeatures([...features, newTag.trim()]);
      setNewTag('');
    }
  };

  // 送出物品通報
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMsg('請先上傳照片或選擇展示範例照！');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('請輸入物品名稱！');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          imageUrl: imagePreview,
          building,
          classroom,
          custodyType,
          custodyDetail,
          features,
          color,
          aiConfidence,
          aiEngine,
          finderName,
          securityQuestion,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onItemCreated();
        onClose();
      } else {
        setErrorMsg(data.error || '通報失敗');
      }
    } catch (err) {
      setErrorMsg('網路傳輸失敗，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 頂部標題 */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">拍照通報教室遺失物</h2>
              <p className="text-xs text-slate-500">上傳照片後，系統將自動啟動 AI 影像分析特徵</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. 照片上傳與 AI 掃描預覽區 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              步驟 1：拍攝或上傳物品照片
            </label>

            {/* 快速示範照片一鍵代入按鈕 */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">快速示範照片：</span>
              {PRESET_DEMO_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* 上傳框 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all overflow-hidden ${
                imagePreview
                  ? 'border-blue-400 bg-slate-50'
                  : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imagePreview ? (
                <div className="relative aspect-16/9 max-h-56 mx-auto rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img src={imagePreview} alt="預覽" className="w-full h-full object-contain" />

                  {/* AI 掃描雷射光動態效果 */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-bounce" />
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs font-bold tracking-wide">
                        AI 多模態神經網路分析特徵中...
                      </p>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" />
                      <span>點擊更換照片</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">點擊選取或拖曳上傳照片</p>
                  <p className="text-xs text-slate-400 mt-0.5">支援 JPG, PNG, WEBP 手機相片</p>
                </div>
              )}
            </div>
          </div>

          {/* 2. AI 辨識分析結果確認 */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  步驟 2：AI 辨識特徵結果 (可手動校正)
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                信心度 {aiConfidence}% ({aiEngine === 'gemini' ? 'Google Gemini' : '智慧模擬引擎'})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 物品名稱 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">物品標題</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：Apple AirPods 藍牙耳機"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                />
              </div>

              {/* 物品類別 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">物品類別</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* 主要顏色 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">主要顏色</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="例如：純白色 / 消光黑"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* AI 特徵標籤管理 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                AI 擷取之特徵標籤 (失主依此核對)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {features.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg shadow-2xs font-medium"
                  >
                    <span>#{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(feat)}
                      className="text-slate-400 hover:text-red-500 p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="手動補充特徵 (例: 刮痕、貼紙、序號)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700"
                >
                  新增標籤
                </button>
              </div>
            </div>
          </div>

          {/* 3. 教室空間與雙軌保管位置 */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              步驟 3：發現教室與實體保管模式 (雙軌機制)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 教學大樓 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">教學大樓</label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                >
                  {BUILDINGS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* 教室代號 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">教室編號 / 空間</label>
                <input
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="例如：M201, T304, 1F 門口"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
                />
              </div>
            </div>

            {/* 雙軌保管切換選項 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  custodyType === 'podium'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="custodyType"
                  value="podium"
                  checked={custodyType === 'podium'}
                  onChange={() => {
                    setCustodyType('podium');
                    setCustodyDetail(`留置於 ${classroom} 講桌中央麥克風旁`);
                  }}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    <span>留置原教室講桌</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    一般用品（如水壺、計算機、雨傘），讓失主直接返回教室講桌拿取。
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  custodyType === 'office'
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="custodyType"
                  value="office"
                  checked={custodyType === 'office'}
                  onChange={() => {
                    setCustodyType('office');
                    setCustodyDetail('已送至管理大樓 3F 資管系辦公室櫃台');
                  }}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>送至處室／警衛室</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    貴重物品（證件、耳機、錢包），送交系辦或生輔組保管防竊。
                  </p>
                </div>
              </label>
            </div>

            {/* 具體實體位置說明 */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                實體存放具體位置詳細說明
              </label>
              <input
                type="text"
                value={custodyDetail}
                onChange={(e) => setCustodyDetail(e.target.value)}
                placeholder="例如：放在講桌麥克風旁 / 送至資管系辦交由助教保管"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* 4. 拾獲者姓名與可選防冒領問答 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                拾獲通報人暱稱
              </label>
              <input
                type="text"
                value={finderName}
                onChange={(e) => setFinderName(e.target.value)}
                placeholder="例如：好心資管二同學"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                防冒領安全問題 (選填)
              </label>
              <input
                type="text"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                placeholder="例如：保護套上的貼紙是什麼圖案？"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* 送出與取消按鈕 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAnalyzing || !imagePreview}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>發布中...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>確認發布拾獲</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
