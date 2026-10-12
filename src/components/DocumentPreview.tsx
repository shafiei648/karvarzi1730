import React from 'react';
import { StudentRecord, TemplateSettings, PrintCopyType } from '../types';
import { toPersianDigits } from '../utils/date';

interface DocumentPreviewProps {
  student: StudentRecord;
  template: TemplateSettings;
  copyType?: PrintCopyType;
  scale?: number;
  isPrintMode?: boolean;
}

export const SingleDocumentPage: React.FC<{
  student: StudentRecord;
  template: TemplateSettings;
  version: 'school' | 'archive';
}> = ({ student, template, version }) => {
  const genderPrefix = student.gender === 'female' ? 'خانم' : 'آقای';
  const issueDateFormatted = student.issueDate ? toPersianDigits(student.issueDate) : '(تاریخ سیستم)';
  const startDateFormatted = student.startDate ? toPersianDigits(student.startDate) : '(تاریخ سیستم)';
  const studentIdFormatted = student.studentId ? toPersianDigits(student.studentId) : '(شماره دانشجویی)';
  const nationalIdFormatted = student.nationalId ? toPersianDigits(student.nationalId) : '(کد ملی)';
  const refLetterNo = student.referenceLetterNo || template.referenceLetterNumber;
  const refLetterDate = template.referenceLetterDate;

  return (
    <div
      className="bg-white text-black text-right relative flex flex-col justify-between selection:bg-slate-200"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 18mm 14mm 18mm',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Vazirmatn', IRANSans, Tahoma, sans-serif",
        fontSize: '13px',
        lineHeight: '1.75',
      }}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-300">
          <div className="w-1/3 text-right">
            <span className="font-bold text-sm">سال تحصیلی {toPersianDigits(template.academicYear)}</span>
          </div>

          <div className="w-1/3 text-center">
            <span className="font-black text-base tracking-wider">{template.headerInvocation}</span>
          </div>

          <div className="w-1/3 text-left">
            <span className="text-sm font-semibold">تاریخ : {issueDateFormatted}</span>
          </div>
        </div>

        {/* Main Document Title */}
        <div className="text-center my-4">
          <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-snug">
            {template.districtTitle ? (
              <>مجوز کارورزی دانشجویان دانشگاه فرهنگیان جهت ورود به آموزشگاه های {template.districtTitle}</>
            ) : (
              'مجوز کارورزی دانشجویان دانشگاه فرهنگیان جهت ورود به آموزشگاه ها'
            )}
          </h1>
          <div className="w-48 h-0.5 bg-black mx-auto mt-1 rounded-full"></div>
        </div>

        {/* Salutation */}
        <div className="mt-3 mb-2 font-bold text-slate-900 text-sm">
          {template.districtSalutation}
        </div>

        {/* Introductory Official Paragraph */}
        <p className="text-justify leading-7 text-[13px] text-slate-900 mb-3">
          سلام علیکم پس از حمد خداوند مهربان و درود و صلوات بر حضرت محمد(ص) و خاندان پاکش ، به عنایت نامه شماره{' '}
          <span className="font-bold font-mono tracking-wide">{toPersianDigits(refLetterNo)}</span> مورخ{' '}
          <span className="font-bold">{toPersianDigits(refLetterDate)}</span> {template.provinceOffice} در خصوص اجرای کارورزی،{' '}
          <span className="font-bold underline decoration-1 underline-offset-4">
            {genderPrefix} {student.fullName || '(نام و نام خانوادگی)'}
          </span>{' '}
          با شماره دانشجویی{' '}
          <span className="font-bold underline decoration-1 underline-offset-4">
            {studentIdFormatted}
          </span>{' '}
          و کد ملی{' '}
          <span className="font-bold underline decoration-1 underline-offset-4">
            {nationalIdFormatted}
          </span>{' '}
          مدارس {template.districtTitle} معرفی می گردد.
        </p>

        {/* Identification & Officer Block */}
        <div className="flex items-start justify-between text-xs mt-3 mb-2 gap-4">
          <div className="space-y-1.5 flex-1">
            <div>
              <span className="font-semibold text-gray-800">مدرک ارائه شده جهت احراز هویت: </span>
              <span className="font-bold text-black">{template.identificationDoc}</span>
            </div>
            <div className="pt-1">
              <span className="font-semibold text-gray-800">روز کارورزی: </span>
              <span className="font-black text-black">({student.dayOfWeek || 'روز سیستم'})</span>
              <span className="mx-2 text-gray-800">از تاریخ</span>
              <span className="font-black text-black">{startDateFormatted}</span>
            </div>
          </div>

          <div className="text-left flex-1 max-w-[260px] text-xs text-gray-800 leading-relaxed font-semibold">
            {template.officerRoleTitle}
          </div>
        </div>

        {/* Approval Signature Boxes (Two Boxes Side by Side) */}
        <div className="grid grid-cols-2 gap-3 my-3">
          {/* Box 1: محل تایید حراست (Right) */}
          <div className="border border-black rounded p-2.5 h-20 flex flex-col justify-start">
            <span className="text-xs font-bold text-center block text-gray-900">
              محل تایید حراست
            </span>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-light select-none print:hidden">
                (مهر و امضای حراست اداره)
              </span>
            </div>
          </div>

          {/* Box 2: محل دستور مدیر ناحیه (Left) */}
          <div className="border border-black rounded p-2.5 h-20 flex flex-col justify-start">
            <span className="text-xs font-bold text-center block text-gray-900">
              محل دستور مدیر ناحیه
            </span>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-light select-none print:hidden">
                (پاراف و دستور مدیریت)
              </span>
            </div>
          </div>
        </div>

        {/* School Target Line and Badge Box */}
        <div className="flex items-center justify-between my-3 gap-2">
          {/* Target School */}
          <div className="flex-1 text-[13px] font-bold">
            <span>مدیر محترم آموزشگاه </span>
            <span className="border-b border-dotted border-black inline-block min-w-[220px] px-2 text-blue-950 font-black">
              {student.targetSchool || template.schoolNamePlaceholder}
            </span>
          </div>

          {/* Highlighted Framed Box */}
          <div className="border-2 border-black rounded px-3 py-1.5 text-center bg-gray-50 print:bg-transparent">
            <span className="font-extrabold text-xs tracking-tight text-black">
              کارورزی ({student.internshipLevel || 'کارورزی'}) - مقطع ({student.gradeLevel || 'مقطع'}) - با رعایت شرط جنسیت
            </span>
          </div>
        </div>

        {/* Respect Salutation */}
        <div className="text-[13px] leading-relaxed my-2 font-semibold">
          با سلام و احترام، {genderPrefix}{' '}
          <span className="font-black text-black">{student.fullName || '(نام و نام خانوادگی)'}</span>{' '}
          با مشخصات فوق جهت انجام کارورزی مطابق موارد ذیل معرفی می گردد.
        </div>

        {/* 5 Regulatory Clauses */}
        <div className="space-y-2 my-2 text-[12px] leading-6 text-justify text-gray-950">
          {template.ruleItems.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="font-bold text-black shrink-0">/{toPersianDigits(idx + 1)}</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area: Signatures & Notes */}
      <div className="mt-4 pt-2">
        {/* Signatures */}
        <div className="flex items-start justify-between min-h-[75px] mb-2">
          {/* Left Signer: همیشه مدیر ناحیه */}
          <div className="text-center w-56">
            <div className="font-extrabold text-xs text-black">{template.managerName}</div>
            <div className="text-xs font-semibold text-gray-800 mt-1">{template.managerRole}</div>
          </div>

          {/* Right Signer: فقط در نسخه بایگانی */}
          {version === 'archive' ? (
            <div className="text-center w-56">
              <div className="font-extrabold text-xs text-black">{template.secondSignerTitle}</div>
              <div className="text-xs font-semibold text-gray-800 mt-1">{template.secondSignerSubtitle}</div>
            </div>
          ) : (
            <div className="w-56"></div>
          )}
        </div>

        {/* Warning Footnote */}
        <div className="text-center text-[11px] font-semibold text-gray-900 border-t border-gray-300 pt-2 pb-1">
          {template.footerNotice}
        </div>

        {/* Version Badge at very bottom center */}
        <div className="text-center text-xs font-bold text-gray-900 pb-1">
          {version === 'school' ? '(نسخه مدرسه)' : '(نسخه بایگانی آموزش نیروی انسانی)'}
        </div>

        {/* Verification strip with student code */}
        {template.includeQrCode && (
          <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-gray-100 print:text-gray-500">
            <span>کد رهگیری سامانه: {student.id.toUpperCase()}</span>
            <span>دانشگاه فرهنگیان • سال تحصیلی {toPersianDigits(template.academicYear)}</span>
            <span>تاریخ صدور: {issueDateFormatted}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  student,
  template,
  copyType = 'both',
}) => {
  return (
    <div className="flex flex-col gap-8 print:gap-0 items-center justify-center w-full">
      {(copyType === 'both' || copyType === 'school') && (
        <div className="shadow-2xl rounded-sm print:shadow-none bg-white border border-gray-200 print:border-none page-break">
          <SingleDocumentPage student={student} template={template} version="school" />
        </div>
      )}

      {(copyType === 'both' || copyType === 'archive') && (
        <div className="shadow-2xl rounded-sm print:shadow-none bg-white border border-gray-200 print:border-none">
          <SingleDocumentPage student={student} template={template} version="archive" />
        </div>
      )}
    </div>
  );
};
