export interface StudentRecord {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  studentId: string; // شماره دانشجویی
  nationalId: string; // کد ملی
  major?: string; // رشته تحصیلی
  universityCampus?: string; // پردیس دانشگاه فرهنگیان
  internshipLevel: string; // کارورزی (۱، ۲، ۳، ۴)
  gradeLevel: string; // مقطع (ابتدایی، متوسطه اول، متوسطه دوم، استثنایی)
  targetSchool: string; // نام آموزشگاه مقصد
  dayOfWeek: string; // روز کارورزی (شنبه، یکشنبه، دوشنبه، سه‌شنبه، چهارشنبه)
  startDate: string; // از تاریخ
  issueDate: string; // تاریخ سیستم / صدور
  referenceLetterNo?: string; // شماره نامه عطف (اختیاری جهت شخصی‌سازی)
  createdAt: string;
}

export interface TemplateSettings {
  academicYear: string; // سال تحصیلی مثلا 1405-1406
  provinceOffice: string; // اداره کل آموزش و پرورش استان اصفهان
  districtTitle: string; // آموزش و پرورش ناحیه ۶
  districtSalutation: string; // مدیریت محترم ناحیه
  referenceLetterNumber: string; // شماره نامه اداره کل مثلا 844/710/1700/05
  referenceLetterDate: string; // تاریخ نامه اداره کل مثلا 1405/07/08
  identificationDoc: string; // کارت دانشجویی+معرفی نامه از دانشگاه فرهنگیان
  officerRoleTitle: string; // کارشناس مسئول فناوری، آمار، توسعه پژوهش و آموزش نیروی انسانی ناحیه ۶ اصفهان
  managerName: string; // منصور فتحی
  managerRole: string; // مدیریت آموزش و پرورش ناحیه۶
  secondSignerTitle: string; // کارشناسی آموزش
  secondSignerSubtitle: string; // مهر و امضا
  footerNotice: string; // ***این مجوز صرفا با مهر و امضا کارشناسی های آموزش نیروی انسانی ، حراست و مدیریت ناحیه معتبر است.
  ruleItems: string[]; // بندهای ۱ تا ۵
  headerInvocation: string; // باسمه تعالی
  includeQrCode: boolean;
  schoolNamePlaceholder: string; // ......................................
}

export type PrintCopyType = 'both' | 'school' | 'archive';
