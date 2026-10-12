import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  FileCheck,
  Building,
  Edit,
  Download,
  Check,
} from 'lucide-react';
import { StudentRecord, TemplateSettings, PrintCopyType } from '../types';
import { DocumentPreview } from './DocumentPreview';
import { toPersianDigits } from '../utils/date';

interface StudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  template: TemplateSettings;
  onEditStudent: (student: StudentRecord) => void;
}

export const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({
  isOpen,
  onClose,
  student,
  template,
  onEditStudent,
}) => {
  const [copyType, setCopyType] = useState<PrintCopyType>('both');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-100 rounded-none md:rounded-2xl shadow-2xl w-full max-w-5xl h-full md:max-h-[96vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Top Control Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  پیش‌نمایش مجوز کارورزی: {student.fullName}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {student.internshipLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                کد ملی: {toPersianDigits(student.nationalId)} • شماره دانشجویی: {toPersianDigits(student.studentId)}
              </p>
            </div>
          </div>

          {/* Action buttons & Copy selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Copy Type Segmented Control */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setCopyType('both')}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  copyType === 'both' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                هر دو نسخه (۲ برگ)
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
              onClick={() => {
                onClose();
                onEditStudent(student);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="ویرایش اطلاعات این دانشجو"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>ویرایش</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / خروجی PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200/80">
          <DocumentPreview student={student} template={template} copyType={copyType} />
        </div>
      </div>
    </div>
  );
};
