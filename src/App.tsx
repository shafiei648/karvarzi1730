import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  Upload,
  Printer,
  Users,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle2,
  HardDrive,
  Download,
  Info,
  Maximize2,
  Minimize2,
  HelpCircle,
} from 'lucide-react';
import { StudentRecord, TemplateSettings } from './types';
import { DEFAULT_TEMPLATE_SETTINGS } from './data/defaultSettings';
import { SAMPLE_STUDENTS } from './data/sampleStudents';
import { DesktopHeader } from './components/DesktopHeader';
import { StudentsTable } from './components/StudentsTable';
import { StudentFormModal } from './components/StudentFormModal';
import { TemplateSettingsModal } from './components/TemplateSettingsModal';
import { StudentPreviewModal } from './components/StudentPreviewModal';
import { BatchPrintModal } from './components/BatchPrintModal';
import { ImportExcelModal } from './components/ImportExcelModal';
import { ExeExportGuideModal } from './components/ExeExportGuideModal';
import { exportStudentsToExcel } from './utils/excel';
import { toPersianDigits } from './utils/date';

const STORAGE_KEY_STUDENTS = 'farhangian_internship_students_v1';
const STORAGE_KEY_TEMPLATE = 'farhangian_internship_template_v1';

export default function App() {
  // Load initial students from localStorage or sample data
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_STUDENTS;
  });

  // Load template settings from localStorage or defaults
  const [template, setTemplate] = useState<TemplateSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATE);
      if (saved) {
        return { ...DEFAULT_TEMPLATE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEMPLATE_SETTINGS;
  });

  // Selected student IDs for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [previewStudent, setPreviewStudent] = useState<StudentRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false);
  const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);
  const [isExeGuideOpen, setIsExeGuideOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // Sync template to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, JSON.stringify(template));
    } catch (e) {
      console.error(e);
    }
  }, [template]);

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3500);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (all: boolean) => {
    if (all) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Student CRUD operations
  const handleSaveStudent = (saved: StudentRecord) => {
    setStudents((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === saved.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = saved;
        return copy;
      } else {
        return [saved, ...prev];
      }
    });
    setEditingStudent(null);
    triggerToast(`اطلاعات کارورز «${saved.fullName}» با موفقیت ذخیره شد`);
  };

  const handleDeleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    if (confirm(`آیا از حذف اطلاعات «${st?.fullName || 'این کارورز'}» اطمینان دارید؟`)) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      triggerToast('کارورز با موفقیت حذف گردید');
    }
  };

  const handleDuplicateStudent = (student: StudentRecord) => {
    const duplicated: StudentRecord = {
      ...student,
      id: `std-${Date.now()}`,
      fullName: `${student.fullName} (کپی)`,
      studentId: `${student.studentId}1`,
      nationalId: `${student.nationalId}1`,
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [duplicated, ...prev]);
    triggerToast(`یک نسخه جدید از «${student.fullName}» ایجاد شد`);
  };

  // Batch delete
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`آیا از حذف تعداد ${selectedIds.length} کارورز انتخاب‌شده اطمینان دارید؟`)) {
      setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      triggerToast('کارورزان انتخاب‌شده با موفقیت حذف شدند');
    }
  };

  // Excel operations
  const handleExportAllExcel = () => {
    if (students.length === 0) {
      alert('لیست کارورزان خالی است');
      return;
    }
    exportStudentsToExcel(students, `لیست_کل_کارورزان_${template.districtTitle.replace(/\s+/g, '_')}.xlsx`);
    triggerToast(`خروجی اکسل برای ${students.length} نفر با موفقیت دریافت شد`);
  };

  const handleExportSelectedExcel = () => {
    const selected = students.filter((s) => selectedIds.includes(s.id));
    if (selected.length === 0) return;
    exportStudentsToExcel(selected, `لیست_کارورزان_منتخب_${selected.length}_نفر.xlsx`);
    triggerToast(`خروجی اکسل برای ${selected.length} نفر منتخب با موفقیت دریافت شد`);
  };

  const handleImportExcel = (importedStudents: StudentRecord[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      setStudents(importedStudents);
    } else {
      setStudents((prev) => [...importedStudents, ...prev]);
    }
    triggerToast(`${importedStudents.length} کارورز از اکسل با موفقیت وارد سامانه شدند`);
  };

  // Fullscreen toggle for desktop software feeling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Compute statistics
  const totalCount = students.length;
  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const uniqueSchools = new Set(students.map((s) => s.targetSchool).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Desktop Top Header Bar */}
      <DesktopHeader
        totalCount={totalCount}
        template={template}
        selectedCount={selectedIds.length}
        onNewStudent={() => {
          setEditingStudent(null);
          setIsStudentFormOpen(true);
        }}
        onExportExcel={handleExportAllExcel}
        onImportExcel={() => setIsImportExcelOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBatchPrint={() => setIsBatchPrintOpen(true)}
        onOpenExeGuide={() => setIsExeGuideOpen(true)}
      />

      {/* Main Software Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {/* Quick KPI & Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
          {/* Card 1: Total */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">مجموع کارورزان</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {toPersianDigits(totalCount)} <span className="text-xs font-normal text-slate-500">دانشجو</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Gender distribution */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">تفکیک جنسیتی</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {toPersianDigits(maleCount)} آقا • {toPersianDigits(femaleCount)} خانم
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Schools */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">مدارس تحت پوشش</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">
                {toPersianDigits(uniqueSchools)} <span className="text-xs font-normal text-slate-500">آموزشگاه</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Academic Year & Status */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">سال تحصیلی فعال</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {toPersianDigits(template.academicYear)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Feature Hint Banner */}
        <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0"></span>
            <span>
              <strong>راهنما:</strong> تمام متغیرهای داخل پرانتز فرم شامل <em>نام و نام خانوادگی، شماره دانشجویی، کد ملی، روز و تاریخ، مقطع و کارورزی</em> از جدول زیر خوانده می‌شوند. قالب کلی نامه (سربرگ، بخشنامه عطف، مدیر، امضاها و بندهای ۵ گانه) از دکمه <strong>«تنظیمات قالب فرم»</strong> قابل ویرایش یکباره است.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedIds(students.map((s) => s.id));
                setIsBatchPrintOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ همه کارورزان ({toPersianDigits(students.length)} برگ)</span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={students}
          template={template}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEdit={(s) => {
            setEditingStudent(s);
            setIsStudentFormOpen(true);
          }}
          onDelete={handleDeleteStudent}
          onDuplicate={handleDuplicateStudent}
          onPreviewAndPrint={(s) => setPreviewStudent(s)}
          onBatchPrintSelected={() => setIsBatchPrintOpen(true)}
          onExportSelectedExcel={handleExportSelectedExcel}
          onDeleteSelected={handleDeleteSelected}
          onAddNew={() => {
            setEditingStudent(null);
            setIsStudentFormOpen(true);
          }}
        />
      </main>

      {/* Desktop App Status Bar (Bottom) */}
      <footer className="no-print bg-slate-900 text-slate-400 text-[11px] border-t border-slate-800 px-4 py-2 mt-auto select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>داده‌ها به طور خودکار در حافظه آفلاین سیستم ذخیره هستند</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">
              خروجی پرینت دو نسخه‌ای: (نسخه مدرسه) + (نسخه بایگانی آموزش نیروی انسانی)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition"
              title="تمام‌صفحه"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه نرم‌افزار'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span>نسخه استاندارد ۱.۰.۰ دسکتاپ</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Student Form Modal (New / Edit) */}
      <StudentFormModal
        isOpen={isStudentFormOpen}
        onClose={() => {
          setIsStudentFormOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />

      {/* Template Settings Modal */}
      <TemplateSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={template}
        onSave={(newSettings) => {
          setTemplate(newSettings);
          triggerToast('تنظیمات قالب فرم با موفقیت ذخیره شد و روی تمام اسناد اعمال گردید');
        }}
      />

      {/* Single Student Preview & Print Modal */}
      {previewStudent && (
        <StudentPreviewModal
          isOpen={Boolean(previewStudent)}
          onClose={() => setPreviewStudent(null)}
          student={previewStudent}
          template={template}
          onEditStudent={(st) => {
            setEditingStudent(st);
            setIsStudentFormOpen(true);
          }}
        />
      )}

      {/* Batch Print Modal */}
      {isBatchPrintOpen && (
        <BatchPrintModal
          isOpen={isBatchPrintOpen}
          onClose={() => setIsBatchPrintOpen(false)}
          students={
            selectedIds.length > 0
              ? students.filter((s) => selectedIds.includes(s.id))
              : students
          }
          template={template}
        />
      )}

      {/* Import from Excel Modal */}
      <ImportExcelModal
        isOpen={isImportExcelOpen}
        onClose={() => setIsImportExcelOpen(false)}
        onImport={handleImportExcel}
      />

      {/* EXE Export Guide Modal */}
      <ExeExportGuideModal
        isOpen={isExeGuideOpen}
        onClose={() => setIsExeGuideOpen(false)}
        appUrl={window.location.href}
      />
    </div>
  );
}
