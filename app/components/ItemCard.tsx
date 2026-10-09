'use client';

import React from 'react';
import { MapPin, Sparkles, Clock, CheckCircle2, ChevronRight, Package, Building } from 'lucide-react';
import { LostItem } from '@/lib/types';

interface ItemCardProps {
  item: LostItem;
  onSelect: (item: LostItem) => void;
}

export default function ItemCard({ item, onSelect }: ItemCardProps) {
  const isAvailable = item.status === 'available';

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffMin < 60) return `${Math.max(1, diffMin)} 分鐘前`;
      if (diffHour < 24) return `${diffHour} 小時前`;
      if (diffDay < 7) return `${diffDay} 天前`;
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch {
      return '日前';
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
    >
      {/* 圖片區域與徽章 */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* 物品照片 */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* 狀態遮罩 (若已領回) */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px] flex items-center justify-center p-3">
            <div className="bg-emerald-500/95 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>已由失主領回結案</span>
            </div>
          </div>
        )}

        {/* 頂部浮動標籤 */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-xs">
            {item.category}
          </span>

          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/90 text-white shadow-sm backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-200" />
            <span>AI {item.aiConfidence}%</span>
          </span>
        </div>

        {/* 底部保管方式標記 */}
        <div className="absolute bottom-2.5 left-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xs flex items-center gap-1 ${
              item.custodyType === 'podium'
                ? 'bg-amber-500/95 text-white'
                : 'bg-blue-600/95 text-white'
            }`}
          >
            {item.custodyType === 'podium' ? (
              <>
                <Package className="w-3 h-3" />
                <span>留置講桌</span>
              </>
            ) : (
              <>
                <Building className="w-3 h-3" />
                <span>送至處室</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 內容區塊 */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
            {item.title}
          </h3>

          {/* 發現地點 */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.building}</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.classroom}</span>
          </div>

          {/* 實體位置說明 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <p className="line-clamp-2 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-100">實體位置：</strong>
              {item.custodyDetail}
            </p>
          </div>

          {/* AI 特徵標籤 */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.features.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200/50 dark:border-slate-700/50"
              >
                #{feat}
              </span>
            ))}
            {item.features.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium">
                +{item.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 底部時間與動作按鈕 */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{formatTime(item.createdAt)}</span>
          </div>

          <button
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              isAvailable
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <span>{isAvailable ? '查看 / 認領' : '查看紀錄'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
