import * as XLSX from 'xlsx';
import { StudentRecord } from '../types';
import { toEnglishDigits } from './date';

export function exportStudentsToExcel(students: StudentRecord[], filename = 'لیست_مجوزهای_کارورزی_فرهنگیان.xlsx') {
  const data = students.map((s, index) => ({
    'ردیف': index + 1,
    'نام و نام خانوادگی': s.fullName,
    'جنسیت': s.gender === 'female' ? 'خانم' : 'آقا',
    'شماره دانشجویی': s.studentId,
    'کد ملی': s.nationalId,
    'دوره کارورزی': s.internshipLevel,
    'مقطع تحصیلی': s.gradeLevel,
    'مدرسه مقصد (آموزشگاه)': s.targetSchool || '---',
    'روز کارورزی': s.dayOfWeek,
    'تاریخ شروع کارورزی': s.startDate,
    'تاریخ صدور مجوز': s.issueDate,
    'رشته تحصیلی': s.major || '',
    'پردیس دانشگاهی': s.universityCampus || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set Right-to-Left orientation for the worksheet
  if (!worksheet['!views']) {
    worksheet['!views'] = [{ rightToLeft: true }];
  }

  // Column widths
  worksheet['!cols'] = [
    { wch: 6 },  // ردیف
    { wch: 22 }, // نام و نام خانوادگی
    { wch: 8 },  // جنسیت
    { wch: 16 }, // شماره دانشجویی
    { wch: 14 }, // کد ملی
    { wch: 14 }, // دوره کارورزی
    { wch: 14 }, // مقطع
    { wch: 26 }, // مدرسه
    { wch: 12 }, // روز کارورزی
    { wch: 14 }, // تاریخ شروع
    { wch: 14 }, // تاریخ صدور
    { wch: 18 }, // رشته
    { wch: 24 }, // پردیس
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'کارورزان');

  XLSX.writeFile(workbook, filename);
}

export function downloadSampleExcelTemplate() {
  const sampleData = [
    {
      'نام و نام خانوادگی': 'رضا محمدی',
      'جنسیت': 'آقا',
      'شماره دانشجویی': '401123456',
      'کد ملی': '1270011223',
      'دوره کارورزی': 'کارورزی ۱',
      'مقطع تحصیلی': 'ابتدایی',
      'مدرسه مقصد (آموزشگاه)': 'دبستان شهید بهشتی',
      'روز کارورزی': 'دوشنبه',
      'تاریخ شروع کارورزی': '1404/08/01',
      'تاریخ صدور مجوز': '1404/07/25',
      'رشته تحصیلی': 'آموزش ابتدایی',
      'پردیس دانشگاهی': 'پردیس شهید باهنر',
    },
    {
      'نام و نام خانوادگی': 'مریم حسینی',
      'جنسیت': 'خانم',
      'شماره دانشجویی': '401654321',
      'کد ملی': '1289988776',
      'دوره کارورزی': 'کارورزی ۲',
      'مقطع تحصیلی': 'متوسطه اول',
      'مدرسه مقصد (آموزشگاه)': 'دبیرستان دخترانه شاهد',
      'روز کارورزی': 'سه‌شنبه',
      'تاریخ شروع کارورزی': '1404/08/02',
      'تاریخ صدور مجوز': '1404/07/25',
      'رشته تحصیلی': 'آموزش ریاضی',
      'پردیس دانشگاهی': 'پردیس فاطمه الزهرا (س)',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 10 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 25 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 24 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قالب_ورود_کارورزان');
  XLSX.writeFile(workbook, 'قالب_اکسل_ورود_دانشجویان_کارورزی.xlsx');
}

export async function parseExcelFile(file: File): Promise<Partial<StudentRecord>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const mapped: Partial<StudentRecord>[] = rawJson.map((row, idx) => {
          // Normalize column headers
          const fullName =
            row['نام و نام خانوادگی'] ||
            row['نام و نام خانوادگی (نام و نام خانوادگی)'] ||
            row['نام'] ||
            row['fullName'] ||
            `دانشجو ${idx + 1}`;

          const genderRaw = String(row['جنسیت'] || row['gender'] || '').trim();
          const gender: 'male' | 'female' =
            genderRaw.includes('خانم') || genderRaw.toLowerCase().includes('female') || genderRaw.toLowerCase() === 'f'
              ? 'female'
              : 'male';

          const studentId = toEnglishDigits(
            String(row['شماره دانشجویی'] || row['شماره دانشجویی (شماره دانشجویی)'] || row['studentId'] || '')
          ).trim();

          const nationalId = toEnglishDigits(
            String(row['کد ملی'] || row['کد ملی (کد ملی)'] || row['nationalId'] || '')
          ).trim();

          const internshipLevel =
            String(row['دوره کارورزی'] || row['کارورزی'] || row['internshipLevel'] || 'کارورزی ۱').trim();

          const gradeLevel =
            String(row['مقطع تحصیلی'] || row['مقطع'] || row['gradeLevel'] || 'ابتدایی').trim();

          const targetSchool =
            String(row['مدرسه مقصد (آموزشگاه)'] || row['آموزشگاه'] || row['نام آموزشگاه'] || row['targetSchool'] || '').trim();

          const dayOfWeek =
            String(row['روز کارورزی'] || row['روز'] || row['dayOfWeek'] || 'دوشنبه').trim();

          const startDate = toEnglishDigits(
            String(row['تاریخ شروع کارورزی'] || row['از تاریخ'] || row['startDate'] || '1404/08/01')
          ).trim();

          const issueDate = toEnglishDigits(
            String(row['تاریخ صدور مجوز'] || row['تاریخ صدور'] || row['issueDate'] || '')
          ).trim();

          const major = String(row['رشته تحصیلی'] || row['رشته'] || row['major'] || '').trim();
          const universityCampus = String(row['پردیس دانشگاهی'] || row['پردیس'] || row['universityCampus'] || '').trim();

          return {
            fullName,
            gender,
            studentId,
            nationalId,
            internshipLevel,
            gradeLevel,
            targetSchool,
            dayOfWeek,
            startDate,
            issueDate,
            major,
            universityCampus,
          };
        });

        resolve(mapped);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
