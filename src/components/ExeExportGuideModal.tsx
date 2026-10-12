import React, { useState } from 'react';
import {
  X,
  Monitor,
  Download,
  Copy,
  Check,
  Terminal,
  Zap,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface ExeExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ExeExportGuideModal: React.FC<ExeExportGuideModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = appUrl || window.location.href;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownloadLauncherBat = () => {
    const batContent = `@echo off
chcp 65001 > nul
title سامانه صدور مجوز کارورزی فرهنگیان
echo در حال اجرای سامانه کارورزی فرهنگیان به صورت اپلیکیشن مستقل...
start msedge --app="${currentUrl}" || start chrome --app="${currentUrl}" || start "${currentUrl}"
exit
`;
    const blob = new Blob([batContent], { type: 'application/bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'اجرای_سامانه_کارورزی_فرهنگیان.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nativefierCommand = `npx nativefier --name "سامانه کارورزی فرهنگیان" "${currentUrl}" --single-instance --disable-dev-tools`;
  const electronCommand = `npm install --save-dev electron electron-builder\nnpm run build:exe`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold">راهنمای خروجی فایل EXE و نصب در ویندوز</h2>
              <p className="text-xs text-blue-200">
                سه روش ساده برای اجرای مستقل این برنامه به صورت فایل دسکتاپ ویندوز
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Method 1: Instant Launcher Download */}
          <div className="border border-blue-200 bg-blue-50/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ۱
                </span>
                <h3 className="font-bold text-blue-950 text-sm">
                  روش فوری (دانلود فایل اجرای دسکتاپ .bat بدون نیاز به نصب هیچ چیز)
                </h3>
              </div>
              <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded">
                پیشنهادی و فوری
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              با کلیک روی دکمه زیر، یک فایل اجرایی ویندوزی (لانچر دسکتاپ) دریافت می‌کنید. کافی است این فایل را روی دسکتاپ رایانه خود قرار داده و دوبار روی آن کلیک کنید تا سامانه دقیقا مثل یک نرم‌افزار دسکتاپ مجزا و بدون کادر مرورگر باز شود.
            </p>

            <button
              onClick={handleDownloadLauncherBat}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل لانچر ویندوز (اجرای_سامانه_کارورزی_فرهنگیان.bat)</span>
            </button>
          </div>

          {/* Method 2: Convert to Standalone Real .EXE using Nativefier */}
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  ۲
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  روش ساخت فایل EXE واقعی با Nativefier (در ۳۰ ثانیه)
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">
                خروجی فایل EXE مستقل
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              اگر می‌خواهید یک فایل <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700">.exe</code> مستقل و کامل داشته باشید، در ویندوز کلید‌های <kbd className="bg-white border px-1.5 py-0.5 rounded shadow-sm">Win + R</kbd> را فشرده و <code className="bg-slate-200 px-1 rounded">cmd</code> را باز کنید، سپس دستور زیر را Paste کنید و Enter بزنید:
            </p>

            <div className="relative bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto text-left" dir="ltr">
              <code>{nativefierCommand}</code>
              <button
                onClick={() => copyToClipboard(nativefierCommand, 'nativefier')}
                className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition"
                title="کپی دستور"
              >
                {copiedCode === 'nativefier' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              این ابزار خودکار یک پوشه حاوی فایل <strong className="text-slate-800">سامانه کارورزی فرهنگیان.exe</strong> تولید می‌کند که می‌توانید آن را روی هر کامپیوتر یا فلش مموری کپی کنید.
            </p>
          </div>

          {/* Method 3: Browser Install (PWA) */}
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ۳
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  روش نصب مستقیم از طریق مرورگر (Install App در کروم یا مایکروسافت اج)
                </h3>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-600">
              <li>
                در همین مرورگر (گوگل کروم یا مایکروسافت اج)، روی سه نقطه بالای مرورگر (منوی سمت راست یا چپ) کلیک کنید.
              </li>
              <li>
                گزینه <strong>«Cast, save and share»</strong> یا <strong>«Apps»</strong> را انتخاب کنید.
              </li>
              <li>
                روی گزینه <strong>«Install this site as an app»</strong> (یا Install سامانه صدور مجوز کارورزی فرهنگیان) کلیک کنید.
              </li>
              <li>
                آیکون سامانه مستقیماً به صفحه Desktop و منوی استارت ویندوز اضافه شده و مثل یک نرم‌افزار ویندوز کار می‌کند.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
