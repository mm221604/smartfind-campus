'use client';

import React from 'react';
import { Search, Building2, X } from 'lucide-react';
import { CampusTheme } from '@/lib/types';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedBuilding: string;
  onBuildingChange: (bldg: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCustody: string;
  onCustodyChange: (custody: string) => void;
  totalFilteredCount: number;
  currentTheme?: CampusTheme;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: '全部類別', value: '全部' },
  { label: '3C周邊', value: '3C周邊' },
  { label: '證件票卡', value: '證件票卡' },
  { label: '保溫瓶水壺', value: '保溫瓶水壺' },
  { label: '雨具衣物', value: '雨具衣物' },
  { label: '書注文具', value: '書注文具' },
  { label: '生活雜物', value: '生活雜物' },
];

const BUILDINGS = [
  '全部',
  '管理大樓 (M棟)',
  '資訊大樓 (I棟)',
  '科技大樓 (T棟)',
  '總圖書館 (LIB)',
  '學生活動中心',
];

export default function FilterBar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBuilding,
  onBuildingChange,
  selectedStatus,
  onStatusChange,
  selectedCustody,
  onCustodyChange,
  totalFilteredCount,
  currentTheme = 'tech-blue',
}: FilterBarProps) {
  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== '全部' ||
    selectedBuilding !== '全部' ||
    selectedStatus !== '全部' ||
    selectedCustody !== '全部';

  const resetAllFilters = () => {
    onSearchChange('');
    onCategoryChange('全部');
    onBuildingChange('全部');
    onStatusChange('全部');
    onCustodyChange('全部');
  };

  const getActiveTabClass = () => {
    switch (currentTheme) {
      case 'crimson-red':
        return 'bg-rose-600 text-white shadow-xs font-semibold';
      case 'emerald-green':
        return 'bg-emerald-600 text-white shadow-xs font-semibold';
      default:
        return 'bg-blue-600 text-white shadow-xs font-semibold';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-8 space-y-4 transition-colors">
      {/* 搜尋列與大樓下拉選單 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* 搜尋輸入框 */}
        <div className="md:col-span-7 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋物品名稱、教室代號 (如 M201)、外觀特徵或標籤..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 校園教學大樓選單 */}
        <div className="md:col-span-5 relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <select
            value={selectedBuilding}
            onChange={(e) => onBuildingChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-slate-100 appearance-none font-medium cursor-pointer"
          >
            {BUILDINGS.map((b) => (
              <option key={b} value={b} className="dark:bg-slate-800 dark:text-slate-100">
                {b === '全部' ? '所有教學大樓 / 場域' : b}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400 dark:text-slate-500">
            ▼
          </div>
        </div>
      </div>

      {/* 類別標籤與第二層篩選器 */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* 物品分類按鈕群 (水平捲動支援) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? getActiveTabClass()
                    : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 雙軌保管模式與狀態切換 */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* 保管方式切換 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => onCustodyChange('全部')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedCustody === '全部'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              所有保管
            </button>
            <button
              onClick={() => onCustodyChange('podium')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedCustody === 'podium'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              📦 原處講桌
            </button>
            <button
              onClick={() => onCustodyChange('office')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedCustody === 'office'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              🏢 系辦/生輔組
            </button>
          </div>

          {/* 認領狀態切換 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => onStatusChange('全部')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedStatus === '全部'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              全部狀態
            </button>
            <button
              onClick={() => onStatusChange('available')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedStatus === 'available'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              🟢 待認領
            </button>
            <button
              onClick={() => onStatusChange('claimed')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedStatus === 'claimed'
                  ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              ✅ 已領回
            </button>
          </div>

          {/* 清除篩選條件 */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>重設條件</span>
            </button>
          )}
        </div>
      </div>

      {/* 搜尋結果筆數提示 */}
      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
        <span>
          目前顯示 <strong className="text-slate-800 dark:text-white">{totalFilteredCount}</strong> 項教室遺失物
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          💡 提示：在教室拾獲物品，可點擊右上角「通報拾獲」上傳！
        </span>
      </div>
    </div>
  );
}
