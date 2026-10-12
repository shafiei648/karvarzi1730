import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Printer,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Building,
  Calendar,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { StudentRecord, TemplateSettings } from '../types';
import {
  toPersianDigits,
  WEEK_DAYS,
  INTERNSHIP_LEVELS,
  GRADE_LEVELS,
} from '../utils/date';

interface StudentsTableProps {
  students: StudentRecord[];
  template: TemplateSettings;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (all: boolean) => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (id: string) => void;
  onDuplicate: (student: StudentRecord) => void;
  onPreviewAndPrint: (student: StudentRecord) => void;
  onBatchPrintSelected: () => void;
  onExportSelectedExcel: () => void;
  onDeleteSelected: () => void;
  onAddNew: () => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  template,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
  onPreviewAndPrint,
  onBatchPrintSelected,
  onExportSelectedExcel,
  onDeleteSelected,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchTerm.trim() ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.includes(searchTerm) ||
        s.nationalId.includes(searchTerm) ||
        (s.targetSchool && s.targetSchool.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchLevel = filterLevel === 'all' || s.internshipLevel === filterLevel;
      const matchDay = filterDay === 'all' || s.dayOfWeek === filterDay;
      const matchGrade = filterGrade === 'all' || s.gradeLevel === filterGrade;

      return matchSearch && matchLevel && matchDay && matchGrade;
    });
  }, [students, searchTerm, filterLevel, filterDay, filterGrade]);

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.includes(s.id));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      onSelectAll(false);
    } else {
      onSelectAll(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Controls & Search Toolbar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام، کد ملی، شماره دانشجویی، مدرسه..."
            className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">همه کارورزی‌ها</option>
            {INTERNSHIP_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">همه مقاطع</option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Day Filter */}
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">همه روزها</option>
            {WEEK_DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Batch Action Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px]">
              {toPersianDigits(selectedIds.length)}
            </span>
            <span>مورد انتخاب شده است</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBatchPrintSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ گروهی انتخاب‌شده‌ها</span>
            </button>

            <button
              onClick={onExportSelectedExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>خروجی اکسل انتخاب‌شده‌ها</span>
            </button>

            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف انتخاب‌شده‌ها</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 select-none">
            <tr>
              <th className="p-3 w-10 text-center">
                <button
                  type="button"
                  onClick={handleSelectAllToggle}
                  className="text-slate-600 hover:text-blue-600 transition"
                  title="انتخاب همه"
                >
                  {allFilteredSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="p-3 w-12 text-center">ردیف</th>
              <th className="p-3">نام و نام خانوادگی</th>
              <th className="p-3">شماره دانشجویی</th>
              <th className="p-3">کد ملی</th>
              <th className="p-3">دوره کارورزی و مقطع</th>
              <th className="p-3">آموزشگاه مقصد</th>
              <th className="p-3">روز کارورزی</th>
              <th className="p-3">تاریخ صدور</th>
              <th className="p-3 text-center w-36">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <GraduationCap className="w-10 h-10 text-slate-300" />
                    <span className="font-bold text-slate-600 text-sm">کارورزی با این مشخصات یافت نشد</span>
                    <span className="text-xs text-slate-400">
                      می‌توانید کارورز جدید اضافه کنید یا فیلترهای جستجو را پاک کنید
                    </span>
                    <button
                      onClick={onAddNew}
                      className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      ثبت اولین کارورز (+)
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const isSelected = selectedIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`transition hover:bg-slate-50 ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(student.id)}
                        className="transition"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>

                    {/* Row index */}
                    <td className="p-3 text-center font-mono text-slate-400">
                      {toPersianDigits(index + 1)}
                    </td>

                    {/* Full Name & Gender */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{student.fullName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                            student.gender === 'female'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {student.gender === 'female' ? 'خانم' : 'آقا'}
                        </span>
                      </div>
                      {student.major && (
                        <span className="text-[10px] text-slate-500 block">{student.major}</span>
                      )}
                    </td>

                    {/* Student ID */}
                    <td className="p-3 font-mono font-medium text-slate-800" dir="ltr">
                      {toPersianDigits(student.studentId)}
                    </td>

                    {/* National ID */}
                    <td className="p-3 font-mono font-medium text-slate-800" dir="ltr">
                      {toPersianDigits(student.nationalId)}
                    </td>

                    {/* Internship Level & Grade */}
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{student.internshipLevel}</div>
                      <span className="text-[11px] text-slate-500">مقطع: {student.gradeLevel}</span>
                    </td>

                    {/* School */}
                    <td className="p-3">
                      <span className="font-medium text-slate-900">
                        {student.targetSchool || (
                          <span className="text-slate-400 italic">تعیین نشده (نقطه‌چین)</span>
                        )}
                      </span>
                    </td>

                    {/* Day & Date */}
                    <td className="p-3">
                      <div className="font-bold text-indigo-900">{student.dayOfWeek}</div>
                      <div className="text-[10px] text-slate-500">
                        از {toPersianDigits(student.startDate)}
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {toPersianDigits(student.issueDate)}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onPreviewAndPrint(student)}
                          className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition"
                          title="پیش‌نمایش و چاپ فرم"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(student)}
                          className="p-1.5 text-amber-600 hover:text-white hover:bg-amber-600 rounded-lg transition"
                          title="ویرایش مشخصات"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDuplicate(student)}
                          className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition"
                          title="کپی ردیف"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(student.id)}
                          className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition"
                          title="حذف کارورز"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          نمایش {toPersianDigits(filteredStudents.length)} مورد از مجموع {toPersianDigits(students.length)} کارورز
        </span>
        <div className="flex items-center gap-3">
          <span>فرمت خروجی پرینت: دو برگ A4 استاندارد (نسخه مدرسه + نسخه بایگانی)</span>
        </div>
      </div>
    </div>
  );
};
