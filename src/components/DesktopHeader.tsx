import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  Upload,
  Printer,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  Monitor,
} from 'lucide-react';
import { TemplateSettings } from '../types';
import { getPersianDayOfWeek, getTodayJalaliString, toPersianDigits } from '../utils/date';

interface DesktopHeaderProps {
  totalCount: number;
  template: TemplateSettings;
  selectedCount: number;
  onNewStudent: () => void;
  onExportExcel: () => void;
  onImportExcel: () => void;
  onOpenSettings: () => void;
  onBatchPrint: () => void;
  onOpenExeGuide: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  totalCount,
  template,
  selectedCount,
  onNewStudent,
  onExportExcel,
  onImportExcel,
  onOpenSettings,
  onBatchPrint,
  onOpenExeGuide,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const today = getTodayJalaliString();
      const dayName = getPersianDayOfWeek();
      const timeStr = new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentDateTime(`${dayName} ${toPersianDigits(today)} - ساعت ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="no-print bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-lg border-b border-slate-700 select-none">
      {/* Top Application Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Titles */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-blue-400/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                نسخه رسمی دسکتاپ
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                سال تحصیلی {toPersianDigits(template.academicYear)}
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white mt-0.5 flex items-center gap-2">
              سامانه صدور مجوز کارورزی فرهنگیان
              <span className="text-xs font-normal text-slate-300">({template.districtTitle})</span>
            </h1>
          </div>
        </div>

        {/* Live System Time and Quick Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentDateTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/50 px-3 py-1.5 rounded-lg text-blue-200">
            <Users className="w-4 h-4 text-blue-400" />
            <span>ثبت‌شده:</span>
            <span className="font-bold text-white text-sm">{toPersianDigits(totalCount)}</span>
            <span>نفر</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-slate-850/90 border-t border-slate-700/60 px-4 py-2.5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Main Primary Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onNewStudent}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-sm transition cursor-pointer"
              title="افزودن مشخصات دانشجو معلم جدید"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ثبت کارورز جدید</span>
            </button>

            <button
              onClick={onExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-sm transition cursor-pointer"
              title="دریافت فایل اکسل تمام اطلاعات کارورزان"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>خروجی اکسل (Excel)</span>
            </button>

            <button
              onClick={onImportExcel}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs rounded-lg border border-slate-600 transition cursor-pointer"
              title="ورود گروهی اطلاعات از اکسل"
            >
              <Upload className="w-4 h-4" />
              <span>ورود از اکسل</span>
            </button>

            {selectedCount > 0 && (
              <button
                onClick={onBatchPrint}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-medium text-xs rounded-lg shadow-sm animate-pulse transition cursor-pointer"
                title="چاپ گروهی فرم‌های دانشجویان انتخاب‌شده"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ گروهی ({toPersianDigits(selectedCount)} مورد)</span>
              </button>
            )}
          </div>

          {/* Configuration and Template Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExeGuide}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-medium text-xs rounded-lg border border-cyan-500/30 transition cursor-pointer"
              title="آموزش ساخت فایل EXE و نصب ویندوز"
            >
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>خروجی به EXE / ویندوز</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 hover:text-white font-medium text-xs rounded-lg border border-indigo-700/60 transition cursor-pointer"
              title="تنظیمات قالب فرم، سال تحصیلی، شماره نامه‌ها، مسئولان و بندها"
            >
              <Settings className="w-4 h-4 text-indigo-300" />
              <span>تنظیمات قالب فرم (یکبار برای همیشه)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
