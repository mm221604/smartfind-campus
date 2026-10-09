'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ItemCard from './components/ItemCard';
import UploadModal from './components/UploadModal';
import ClaimModal from './components/ClaimModal';
import SettingsModal from './components/SettingsModal';
import { LostItem, CampusTheme } from '@/lib/types';
import { Camera, Sparkles, Search } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 篩選狀態
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedBuilding, setSelectedBuilding] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [selectedCustody, setSelectedCustody] = useState('全部');

  // 彈窗開關狀態
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  // API Key 狀態 (持久化於 localStorage)
  const [apiKey, setApiKey] = useState('');

  // 深色模式與校園主題色彩狀態
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<CampusTheme>('tech-blue');

  // 讀取本機偏好設定
  useEffect(() => {
    const savedKey = localStorage.getItem('smartfind_gemini_api_key') || '';
    setApiKey(savedKey);

    const savedTheme = (localStorage.getItem('smartfind_theme') as CampusTheme) || 'tech-blue';
    setCurrentTheme(savedTheme);

    const savedDark = localStorage.getItem('smartfind_dark_mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedDark !== null ? savedDark === 'true' : prefersDark;
    setIsDarkMode(initialDark);

    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 切換深色模式
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('smartfind_dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // 切換校園主題色
  const handleSelectTheme = (theme: CampusTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('smartfind_theme', theme);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('smartfind_gemini_api_key', key);
  };

  // 取得遺失物資料清單
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory !== '全部') params.set('category', selectedCategory);
      if (selectedBuilding !== '全部') params.set('building', selectedBuilding);
      if (selectedStatus !== '全部') params.set('status', selectedStatus);
      if (selectedCustody !== '全部') params.set('custodyType', selectedCustody);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedBuilding, selectedStatus, selectedCustody]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 重設為展示種子資料
  const handleResetData = async () => {
    if (!confirm('確定要將系統資料重設回預設的校園展示示範資料嗎？')) return;
    try {
      const res = await fetch('/api/items/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // 取得 Hero 橫幅漸層背景
  const getHeroGradient = () => {
    switch (currentTheme) {
      case 'crimson-red':
        return 'from-rose-800 via-red-800 to-slate-950';
      case 'emerald-green':
        return 'from-emerald-800 via-teal-800 to-slate-950';
      default:
        return 'from-blue-700 via-indigo-700 to-slate-900';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-250">
      {/* 頂部導覽列 */}
      <Navbar
        items={items}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
        apiKey={apiKey}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* 主體內容容器 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* 橫幅 Hero 介紹區塊 */}
        <section
          className={`mb-8 rounded-3xl bg-gradient-to-br ${getHeroGradient()} text-white p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all duration-300`}
        >
          {/* 背景裝飾光暈 */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/15 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI 多模態辨識 • 教室講桌/系辦雙軌保管</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3 leading-snug">
              教室下課忘了帶走？
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                拍照即辨識，一鍵通報智慧招領
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed mb-6">
              專為大學校園教室打造！好心同學拾獲隨手拍照，AI 自動提取外觀顏色與特徵標籤；
              清楚標示「留在原教室講桌」或「已送交系辦櫃台」，告別 Dcard 洗版與尋物無門。
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                <span>立即拍照通報拾獲</span>
              </button>
              <button
                onClick={() => {
                  setSelectedStatus('available');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span>尋找待認領物品</span>
              </button>
            </div>
          </div>
        </section>

        {/* 篩選與搜尋列 */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedBuilding={selectedBuilding}
          onBuildingChange={setSelectedBuilding}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCustody={selectedCustody}
          onCustodyChange={setSelectedCustody}
          totalFilteredCount={items.length}
          currentTheme={currentTheme}
        />

        {/* 物品卡片動態探索牆 (Feed Grid) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-4/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="h-10 bg-slate-100 dark:bg-slate-850 rounded-xl" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">找不到相符的遺失物</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              目前篩選條件下沒有找到任何通報紀錄，您可以嘗試清除關鍵字或擴大搜尋大樓範圍。
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('全部');
                  setSelectedBuilding('全部');
                  setSelectedStatus('全部');
                  setSelectedCustody('全部');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                重設所有條件
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>通報新拾獲</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 頁尾資訊 */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">SmartFind</span> • 資訊管理學系畢業專題原型系統 (MIS Capstone Project Demo)
          </div>
          <div className="text-slate-400 dark:text-slate-500 flex items-center gap-4">
            <span>支援雙軌教室保管模式</span>
            <span>•</span>
            <span>Google Gemini 多模態 AI 整合</span>
          </div>
        </div>
      </footer>

      {/* 彈窗群組 */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onItemCreated={fetchItems}
        apiKey={apiKey}
        currentTheme={currentTheme}
      />

      <ClaimModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onClaimSuccess={fetchItems}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
