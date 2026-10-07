'use client';

import React from 'react';
import { Camera, Sparkles, RefreshCw, KeyRound, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';
import { LostItem } from '@/lib/types';

interface NavbarProps {
  items: LostItem[];
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
  apiKey: string;
}

export default function Navbar({
  items,
  onOpenUpload,
  onOpenSettings,
  onResetData,
  apiKey,
}: NavbarProps) {
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.status === 'available').length;
  const claimedItems = items.filter((i) => i.status === 'claimed').length;
  const claimRate = totalItems > 0 ? Math.round((claimedItems / totalItems) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & 系統標題 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  SmartFind
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  校園教室智慧招領
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                資管系畢業專題原型系統 • 教室遺失物拍照即辨識 & 雙軌保管
              </p>
            </div>
          </div>

          {/* 數據小儀表板 (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>總通報:</span>
              <span className="font-bold text-slate-900 text-sm">{totalItems}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>待認領:</span>
              <span className="font-bold text-emerald-600 text-sm">{availableItems}</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>成功領回率:</span>
              <span className="font-bold text-indigo-600 text-sm">{claimRate}%</span>
            </div>
          </div>

          {/* 右側操作按鈕群 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI 模式指示器 / 設定按鈕 */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg border transition-all ${
                apiKey
                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="點擊設定 AI 視覺引擎模式"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiKey ? 'Gemini 1.5 API 模式' : '內建智慧模擬 (免Key)'}
              </span>
              <span className="sm:hidden">
                {apiKey ? 'Gemini' : '智慧模擬'}
              </span>
            </button>

            {/* 重設展示資料按鈕 */}
            <button
              onClick={onResetData}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all flex items-center gap-1.5"
              title="重設回預設展示種子資料"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">重設展示資料</span>
            </button>

            {/* 拍照通報拾獲 按鈕 */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>拍照通報拾獲</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
