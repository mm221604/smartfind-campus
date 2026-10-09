'use client';

import React, { useState } from 'react';
import { X, KeyRound, Sparkles, Check, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">AI 視覺辨識引擎設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* 目前運作模式提示 */}
          <div
            className={`p-4 rounded-2xl border ${
              apiKey
                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
              <span>
                目前模式：{apiKey ? '🟣 Google Gemini 1.5 Flash 真實 AI 視覺' : '🟢 內建智慧模擬引擎 (Smart Mock)'}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {apiKey
                ? '系統已配置真實 Gemini API Key，上傳照片時將直接送往 Google Gemini 進行多模態即時視覺推理。'
                : '系統採用內建啟發式智慧模擬引擎，不需消耗任何 API Token 亦能展示極致擬真的 AI 類別與特徵辨識流程，專案展示最穩健！'}
            </p>
          </div>

          {/* Gemini API Key 輸入 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Google AI Studio API Key (選填)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>取得免費 API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-mono text-slate-800 dark:text-slate-100"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              * Key 將保存在您本機瀏覽器中，隨時可清空恢復為免 Key 模擬模式。
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>設定已成功儲存！</span>
            </div>
          )}

          {/* 按鈕群 */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold px-2 py-1 cursor-pointer"
              >
                清除 API Key (切回模擬模式)
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                關閉
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>儲存設定</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
