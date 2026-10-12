/**
 * Persian Date and Number Utilities
 */

export function getTodayJalaliString(): string {
  try {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(today);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    if (year && month && day) {
      return `${toEnglishDigits(year)}/${toEnglishDigits(month)}/${toEnglishDigits(day)}`;
    }
  } catch {
    // fallback
  }
  return '1404/07/15';
}

export function getPersianDayOfWeek(date?: Date): string {
  try {
    const d = date || new Date();
    const formatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
    return formatter.format(d);
  } catch {
    return 'دوشنبه';
  }
}

export function toPersianDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (w) => id[+w]);
}

export function toEnglishDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = String(str);
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(faDigits[i], String(i)).replaceAll(arDigits[i], String(i));
  }
  return res;
}

export const WEEK_DAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
];

export const INTERNSHIP_LEVELS = [
  'کارورزی ۱',
  'کارورزی ۲',
  'کارورزی ۳',
  'کارورزی ۴',
];

export const GRADE_LEVELS = [
  'ابتدایی',
  'متوسطه اول',
  'متوسطه دوم',
  'کودکان استثنایی',
  'فنی و حرفه‌ای / کاردانش',
];
