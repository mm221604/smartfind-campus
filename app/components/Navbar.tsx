'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, RefreshCw, PackageCheck, Sun, Moon, Palette } from 'lucide-react';
import { LostItem, CampusTheme } from '@/lib/types';

interface NavbarProps {
  items: LostItem[];
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  apiKey: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: CampusTheme;
  onSelectTheme: (theme: CampusTheme) => void;
}

const THEME_OPTIONS: { id: CampusTheme; label: string; dotClass: string }[] = [
  { id: 'tech-blue', label: '科技藍紫', dotClass: 'bg-blue-600' },
  { id: 'crimson-red', label: '校徽深紅', dotClass: 'bg-rose-600' },
  { id: 'emerald-green', label: '翡翠學院綠', dotClass: 'bg-emerald-600' },
];

export default function Navbar({
  items,
  onOpenUpload,
  onOpenSettings,
  onResetData,
  apiKey,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onSelectTheme,
}: NavbarProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const totalItems = items.length;
  const availableItems = items.filter((i) => i.status === 'available').length;
  const claimedItems = items.filter((i) => i.status === 'claimed').length;
  const claimRate = totalItems > 0 ? Math.round((claimedItems / totalItems) * 100) : 0;

  // 根據當前選擇的主題動態調整主色按鈕樣式
  const getButtonGradient = () => {
    switch (currentTheme) {
      case 'crimson-red':
        return 'from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 shadow-rose-200 dark:shadow-none';
      case 'emerald-green':
        return 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-200 dark:shadow-none';
      default:
        return 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-indigo-200 dark:shadow-none';
    }
  };

  const getLogoGradient = () => {
    switch (currentTheme) {
      case 'crimson-red':
        return 'from-rose-600 via-red-600 to-orange-500';
      case 'emerald-green':
        return 'from-emerald-600 via-teal-600 to-cyan-500';
      default:
        return 'from-blue-600 via-indigo-600 to-violet-500';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & 系統標題 */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr ${getLogoGradient()} flex items-center justify-center text-white shadow-md shrink-0 transition-all`}
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  SmartFind
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  校園教室智慧招領
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                資管系畢業專題系統 • 教室遺失物拍照即辨識 & 雙軌保管
              </p>
            </div>
          </div>

          {/* 數據小儀表板 (Desktop) */}
          <div className="hidden lg:flex items-center gap-5 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>總通報:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{totalItems}</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>待認領:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{availableItems}</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>領回率:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{claimRate}%</span>
            </div>
          </div>

          {/* 右側操作按鈕群 */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 深色模式切換按鈕 (Sun / Moon) */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title={isDarkMode ? '切換為明亮模式' : '切換為深色模式'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span className="text-xs font-semibold hidden md:inline">
                {isDarkMode ? '深色' : '淺色'}
              </span>
            </button>

            {/* 校園主題色選擇器選單 */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                title="切換校園配色主題"
              >
                <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span className="text-xs font-semibold hidden md:inline">校系配色</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1 uppercase">
                    校系代表色
                  </div>
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onSelectTheme(theme.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium rounded-xl transition-colors ${
                        currentTheme === theme.id
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.dotClass}`} />
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI 模式指示器 / 設定按鈕 */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-medium rounded-xl border transition-all ${
                apiKey
                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
              title="點擊設定 AI 視覺引擎模式"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiKey ? 'Gemini 視覺' : '智慧模擬'}
              </span>
            </button>

            {/* 重設展示資料按鈕 */}
            <button
              onClick={onResetData}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all flex items-center gap-1.5"
              title="重設回預設展示種子資料"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">重設資料</span>
            </button>

            {/* 拍照通報拾獲 按鈕 */}
            <button
              onClick={onOpenUpload}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${getButtonGradient()} rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer`}
            >
              <Camera className="w-4 h-4" />
              <span>通報拾獲</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
