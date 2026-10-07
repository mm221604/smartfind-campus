'use client';

import React from 'react';
import { MapPin, Sparkles, Clock, ShieldCheck, CheckCircle2, ChevronRight, Package, Building } from 'lucide-react';
import { LostItem } from '@/lib/types';

interface ItemCardProps {
  item: LostItem;
  onSelect: (item: LostItem) => void;
}

export default function ItemCard({ item, onSelect }: ItemCardProps) {
  const isAvailable = item.status === 'available';

  // 格式化時間（相對時間或簡單日期）
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
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* 圖片區域與徽章 */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {/* 物品照片 */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* 狀態遮罩 (若已領回) */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-emerald-500 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>已由失主領回結案</span>
            </div>
          </div>
        )}

        {/* 頂部浮動標籤 */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* 物品類別 */}
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
            {item.category}
          </span>

          {/* AI 辨識信心度徽章 */}
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
          {/* 標題 */}
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {item.title}
          </h3>

          {/* 發現地點 (大樓與教室) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-slate-800 font-semibold">{item.building}</span>
            <span className="text-slate-400">•</span>
            <span className="text-blue-600 font-semibold">{item.classroom}</span>
          </div>

          {/* 實體位置具體說明 */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-xs text-slate-600 mb-3">
            <p className="line-clamp-2 leading-relaxed">
              <strong className="text-slate-700">實體位置：</strong>
              {item.custodyDetail}
            </p>
          </div>

          {/* AI 特徵標籤 */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.features.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
              >
                #{feat}
              </span>
            ))}
            {item.features.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 font-medium">
                +{item.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 底部時間與動作按鈕 */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{formatTime(item.createdAt)}</span>
          </div>

          <button
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
              isAvailable
                ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                : 'bg-slate-100 text-slate-500'
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
