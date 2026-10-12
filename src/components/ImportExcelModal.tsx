import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { StudentRecord } from '../types';
import { downloadSampleExcelTemplate, parseExcelFile } from '../utils/excel';
import { toPersianDigits, getTodayJalaliString } from '../utils/date';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedStudents: StudentRecord[], mode: 'append' | 'replace') => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Partial<StudentRecord>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      const records = await parseExcelFile(selectedFile);
      if (records.length === 0) {
        setError('هیچ ردیفی در فایل اکسل یافت نشد. لطفاً ساختار فایل را بررسی فرمایید.');
      } else {
        setPreviewData(records);
      }
    } catch (err: any) {
      console.error(err);
      setError('خطا در خواندن فایل اکسل. لطفاً از فایل اکسل استاندارد (.xlsx) استفاده کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewData.length === 0) return;

    const fullRecords: StudentRecord[] = previewData.map((p, idx) => ({
      id: `std-imp-${Date.now()}-${idx}`,
      fullName: p.fullName || `کارورز ${idx + 1}`,
      gender: p.gender || 'male',
      studentId: p.studentId || String(100000 + idx),
      nationalId: p.nationalId || String(2000000000 + idx),
      major: p.major || '',
      universityCampus: p.universityCampus || '',
      internshipLevel: p.internshipLevel || 'کارورزی ۱',
      gradeLevel: p.gradeLevel || 'ابتدایی',
      targetSchool: p.targetSchool || '',
      dayOfWeek: p.dayOfWeek || 'دوشنبه',
      startDate: p.startDate || getTodayJalaliString(),
      issueDate: p.issueDate || getTodayJalaliString(),
      createdAt: new Date().toISOString(),
    }));

    onImport(fullRecords, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">ورود دسته‌ای دانشجویان از اکسل</h2>
              <p className="text-xs text-emerald-100">
                فایل اکسل اسامی و مشخصات دانشجویان را بارگذاری کنید تا یکجا وارد سیستم شوند
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Download Sample Banner */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="font-bold text-emerald-900 block">نمونه فایل اکسل آماده</span>
                <span className="text-[11px] text-emerald-700">
                  جهت اطمینان از نام ستون‌ها می‌توانید ابتدا این نمونه را دریافت و پر کنید.
                </span>
              </div>
            </div>
            <button
              onClick={downloadSampleExcelTemplate}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              دانلود فایل الگو
            </button>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/40 cursor-pointer transition flex flex-col items-center justify-center gap-2"
          >
            <Upload className="w-8 h-8 text-slate-400" />
            <span className="font-bold text-slate-700 text-sm">
              {file ? file.name : 'انتخاب یا رها کردن فایل اکسل (.xlsx, .xls)'}
            </span>
            <span className="text-[11px] text-slate-500">
              کلیک کنید تا فایل خود را از رایانه انتخاب نمایید
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview Table if loaded */}
          {previewData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تعداد {toPersianDigits(previewData.length)} ردیف شناسایی شد:</span>
                </span>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>افزودن به لیست فعلی</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>جایگزینی کل لیست</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-right text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2">نام و نام خانوادگی</th>
                      <th className="p-2">جنسیت</th>
                      <th className="p-2">شماره دانشجویی</th>
                      <th className="p-2">کد ملی</th>
                      <th className="p-2">کارورزی</th>
                      <th className="p-2">مقطع</th>
                      <th className="p-2">مدرسه</th>
                      <th className="p-2">روز</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.slice(0, 15).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-semibold">{row.fullName}</td>
                        <td className="p-2">{row.gender === 'female' ? 'خانم' : 'آقا'}</td>
                        <td className="p-2 font-mono" dir="ltr">{toPersianDigits(row.studentId)}</td>
                        <td className="p-2 font-mono" dir="ltr">{toPersianDigits(row.nationalId)}</td>
                        <td className="p-2">{row.internshipLevel}</td>
                        <td className="p-2">{row.gradeLevel}</td>
                        <td className="p-2">{row.targetSchool || '---'}</td>
                        <td className="p-2">{row.dayOfWeek}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 15 && (
                <div className="text-[10px] text-slate-500 text-center">
                  ... و {toPersianDigits(previewData.length - 15)} ردیف دیگر
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            انصراف
          </button>
          <button
            disabled={previewData.length === 0 || isLoading}
            onClick={handleConfirmImport}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
          >
            تایید و ورود {toPersianDigits(previewData.length)} کارورز
          </button>
        </div>
      </div>
    </div>
  );
};
