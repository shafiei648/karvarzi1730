import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  UserCheck,
  School,
  Calendar,
  Sparkles,
  GraduationCap,
  FileCheck2,
} from 'lucide-react';
import { StudentRecord } from '../types';
import {
  WEEK_DAYS,
  INTERNSHIP_LEVELS,
  GRADE_LEVELS,
  getTodayJalaliString,
  getPersianDayOfWeek,
  toPersianDigits,
} from '../utils/date';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: StudentRecord) => void;
  initialData?: StudentRecord | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<StudentRecord>>({
    fullName: '',
    gender: 'male',
    studentId: '',
    nationalId: '',
    major: 'آموزش ابتدایی',
    universityCampus: 'پردیس دانشگاه فرهنگیان',
    internshipLevel: 'کارورزی ۱',
    gradeLevel: 'ابتدایی',
    targetSchool: '',
    dayOfWeek: 'دوشنبه',
    startDate: getTodayJalaliString(),
    issueDate: getTodayJalaliString(),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: '',
        gender: 'male',
        studentId: '',
        nationalId: '',
        major: 'آموزش ابتدایی',
        universityCampus: 'پردیس دانشگاه فرهنگیان اصفهان',
        internshipLevel: 'کارورزی ۱',
        gradeLevel: 'ابتدایی',
        targetSchool: '',
        dayOfWeek: getPersianDayOfWeek(),
        startDate: getTodayJalaliString(),
        issueDate: getTodayJalaliString(),
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof StudentRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!formData.fullName?.trim()) {
      err.fullName = 'لطفاً نام و نام خانوادگی را وارد نمایید';
    }
    if (!formData.studentId?.trim()) {
      err.studentId = 'لطفاً شماره دانشجویی را وارد نمایید';
    }
    if (!formData.nationalId?.trim()) {
      err.nationalId = 'لطفاً کد ملی را وارد نمایید';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const student: StudentRecord = {
      id: initialData?.id || `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: formData.fullName!.trim(),
      gender: formData.gender || 'male',
      studentId: formData.studentId!.trim(),
      nationalId: formData.nationalId!.trim(),
      major: formData.major?.trim() || '',
      universityCampus: formData.universityCampus?.trim() || '',
      internshipLevel: formData.internshipLevel || 'کارورزی ۱',
      gradeLevel: formData.gradeLevel || 'ابتدایی',
      targetSchool: formData.targetSchool?.trim() || '',
      dayOfWeek: formData.dayOfWeek || 'دوشنبه',
      startDate: formData.startDate?.trim() || getTodayJalaliString(),
      issueDate: formData.issueDate?.trim() || getTodayJalaliString(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {initialData ? 'ویرایش مشخصات کارورز' : 'ثبت کارورز جدید (ورودی متغیرهای داخل پرانتز)'}
              </h2>
              <p className="text-xs text-blue-100">
                مشخصات زیر در فرم پرینت و فایل اکسل جایگذاری می‌شوند
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Section 1: Individual Identifiers */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>مشخصات فردی دانشجو معلم</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">جنسیت</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="male">آقا (آقای)</option>
                  <option value="female">خانم (سرکار خانم)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  شماره دانشجویی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => handleChange('studentId', e.target.value)}
                  placeholder="مثال: 401123456"
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.studentId ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  dir="ltr"
                />
                {errors.studentId && <p className="text-red-500 text-[10px] mt-0.5">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  کد ملی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => handleChange('nationalId', e.target.value)}
                  placeholder="مثال: 1271234567"
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.nationalId ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  dir="ltr"
                />
                {errors.nationalId && <p className="text-red-500 text-[10px] mt-0.5">{errors.nationalId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">رشته تحصیلی (اختیاری)</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleChange('major', e.target.value)}
                  placeholder="مثال: آموزش ابتدایی، آموزش ریاضی"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">پردیس محل تحصیل (اختیاری)</label>
                <input
                  type="text"
                  value={formData.universityCampus}
                  onChange={(e) => handleChange('universityCampus', e.target.value)}
                  placeholder="مثال: پردیس شهید باهنر"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Internship & School Details */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <School className="w-4 h-4 text-emerald-600" />
              <span>مشخصات کارورزی و مدرسه مقصد</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">دوره کارورزی</label>
                <div className="flex gap-2">
                  <select
                    value={formData.internshipLevel}
                    onChange={(e) => handleChange('internshipLevel', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INTERNSHIP_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">مقطع تحصیلی</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => handleChange('gradeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                نام آموزشگاه مقصد (مدرسه)
              </label>
              <input
                type="text"
                value={formData.targetSchool}
                onChange={(e) => handleChange('targetSchool', e.target.value)}
                placeholder="مثال: دبستان پسرانه شهید بهشتی (در صورت خالی بودن نقطه‌چین چاپ می‌شود)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                اگر خالی بماند، در چاپ به صورت «......................................» درج خواهد شد.
              </span>
            </div>
          </div>

          {/* Section 3: Time & System Dates */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>زمان‌بندی و تاریخ‌های سیستم (داخل پرانتزها)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">روز کارورزی</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => handleChange('dayOfWeek', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {WEEK_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تاریخ شروع (از تاریخ)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    placeholder="1404/08/01"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('startDate', getTodayJalaliString())}
                    className="px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px]"
                    title="تاریخ روز"
                  >
                    امروز
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تاریخ صدور مجوز</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => handleChange('issueDate', e.target.value)}
                    placeholder="1404/07/28"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('issueDate', getTodayJalaliString())}
                    className="px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px]"
                    title="تاریخ روز"
                  >
                    امروز
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preview Highlight Box */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-slate-800">
            <span className="font-bold text-[11px] text-blue-900 block mb-1">
              پیش‌نمایش متن کادر در فرم:
            </span>
            <div className="text-[11px] font-semibold text-slate-700">
              کارورزی ({formData.internshipLevel || '...'}) - مقطع ({formData.gradeLevel || '...'}) - با رعایت شرط جنسیت
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'بروزرسانی مشخصات' : 'ثبت و تایید کارورز'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
