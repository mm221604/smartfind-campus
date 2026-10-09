'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, MapPin, Package, Building, ShieldCheck, Sparkles, Clock, AlertCircle, PartyPopper } from 'lucide-react';
import { LostItem } from '@/lib/types';
import confetti from 'canvas-confetti';

interface ClaimModalProps {
  item: LostItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: () => void;
}

export default function ClaimModal({
  item,
  isOpen,
  onClose,
  onClaimSuccess,
}: ClaimModalProps) {
  const [claimedBy, setClaimedBy] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  if (!isOpen || !item) return null;

  const isAvailable = item.status === 'available';

  const triggerConfettiCelebration = () => {
    // 釋放左側與右側慶祝彩帶
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    });
    // 中央綻放
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    }, 200);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedBy.trim()) {
      setErrorMsg('請填寫認領人姓名或學生證學號！');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const combinedNotes = [
        item.securityQuestion ? `【安全提問回答】${securityAnswer}` : '',
        claimNotes ? `【核對備註】${claimNotes}` : '',
      ]
        .filter(Boolean)
        .join(' ； ');

      const res = await fetch(`/api/items/${item.id}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimedBy: claimedBy.trim(),
          claimNotes: combinedNotes || '失主現場或線上核對特徵吻合，已完成認領。',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCelebration(true);
        triggerConfettiCelebration();
        setTimeout(() => {
          onClaimSuccess();
          setShowCelebration(false);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.error || '認領處理失敗');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg('網路傳輸失敗，請稍後再試。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* 頂部導航 */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {isAvailable ? '遺失物詳情與認領取回' : '遺失物已領回結案紀錄'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 慶祝成功動畫遮罩 */}
        {showCelebration ? (
          <div className="p-12 text-center space-y-4 animate-in zoom-in-95 fade-in">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 shadow-xl">
              <PartyPopper className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              恭喜！已成功認領結案 🎉
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              物品已順利物歸原主，感謝校園好心同學與 SmartFind 智慧招領系統！
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 物品照片與主要資訊 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              <div className="sm:col-span-5 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>AI {item.aiConfidence}%</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{item.building}</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.classroom}</span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>拾獲時間：{new Date(item.createdAt).toLocaleString('zh-TW')}</span>
                </div>
              </div>
            </div>

            {/* 實體領取指引（雙軌機制） */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {item.custodyType === 'podium' ? (
                  <>
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>實體保管位置：留置原教室講桌</span>
                  </>
                ) : (
                  <>
                    <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>實體保管位置：已送交處室／警衛室</span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                📍 <strong>取回地點說明：</strong> {item.custodyDetail}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.custodyType === 'podium'
                  ? '提示：請同學自行返回教室講桌確認取回；取回後請在下方點擊「確認領取」以結案通知大家。'
                  : '提示：貴重物品由管理單位保管，請至該處室櫃台出示證件並核對細節領取。'}
              </p>
            </div>

            {/* AI 特徵標籤一覽 */}
            <div>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                AI 辨識特徵與標籤
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200/60 dark:border-slate-700"
                  >
                    #{feat}
                  </span>
                ))}
              </div>
            </div>

            {/* 認領狀態區塊 */}
            {isAvailable ? (
              <form onSubmit={handleClaimSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>這是你的物品嗎？請填寫取回確認</span>
                </div>

                {item.securityQuestion && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>拾獲者設定之防冒領提問：</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{item.securityQuestion}</p>
                    <input
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="請回答上述特徵問題以供核對..."
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg outline-hidden text-slate-800 dark:text-slate-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    認領人姓名與系所學號 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={claimedBy}
                    onChange={(e) => setClaimedBy(e.target.value)}
                    placeholder="例如：資管二 11204055 王同學"
                    required
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    核對備註說明 (選填)
                  </label>
                  <input
                    type="text"
                    value={claimNotes}
                    onChange={(e) => setClaimNotes(e.target.value)}
                    placeholder="例如：已至 M201 講桌拿回 / 已向助教出示學生證確認"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-hidden focus:border-emerald-500 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    先關閉
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? '處理中...' : '確認已取回 (結案標記)'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>此遺失物已結案領回</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>認領人：</strong> {item.claimedBy || '已確認失主'}
                </p>
                {item.claimedAt && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>結案時間：</strong> {new Date(item.claimedAt).toLocaleString('zh-TW')}
                  </p>
                )}
                {item.claimNotes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>核對紀錄：</strong> {item.claimNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
