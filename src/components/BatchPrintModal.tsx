import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Copy,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { StudentRecord, TemplateSettings, PrintCopyType } from '../types';
import { SingleDocumentPage } from './DocumentPreview';
import { toPersianDigits } from '../utils/date';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentRecord[];
  template: TemplateSettings;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  template,
}) => {
  const [copyType, setCopyType] = useState<PrintCopyType>('both');

  if (!isOpen || students.length === 0) return null;

  const totalPages =
    copyType === 'both' ? students.length * 2 : students.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-100 rounded-none md:rounded-2xl shadow-2xl w-full max-w-5xl h-full md:max-h-[95vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>پیش‌نمایش و چاپ فرم‌ها</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {toPersianDigits(students.length)} کارورز انتخاب‌شده
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                مجموع صفحات خروجی برای چاپ: {toPersianDigits(totalPages)} صفحه استاندارد A4
              </p>
            </div>
          </div>

          {/* Print Options */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setCopyType('both')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  copyType === 'both' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                هر دو نسخه (مدرسه + بایگانی)
              </button>
              <button
                onClick={() => setCopyType('school')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  copyType === 'school' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                فقط نسخه مدرسه
              </button>
              <button
                onClick={() => setCopyType('archive')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  copyType === 'archive' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                فقط نسخه بایگانی
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ارسال به چاپگر / ذخیره PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational tip bar */}
        <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            نکته جهت بهترین کیفیت چاپ: در پنجره چاپ مرورگر، گزینه <strong>Margins</strong> را روی <strong>None</strong> یا <strong>Default</strong> قرار داده و تیک <strong>Background graphics</strong> را فعال بگذارید.
          </span>
        </div>

        {/* Printable Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-200/80">
          {students.map((student, idx) => (
            <React.Fragment key={student.id}>
              {/* School Copy */}
              {(copyType === 'both' || copyType === 'school') && (
                <div className="page-break flex justify-center mb-6">
                  <div className="shadow-xl rounded bg-white overflow-hidden print:shadow-none print:border-none">
                    <SingleDocumentPage student={student} template={template} version="school" />
                  </div>
                </div>
              )}

              {/* Archive Copy */}
              {(copyType === 'both' || copyType === 'archive') && (
                <div className="page-break flex justify-center mb-6">
                  <div className="shadow-xl rounded bg-white overflow-hidden print:shadow-none print:border-none">
                    <SingleDocumentPage student={student} template={template} version="archive" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
