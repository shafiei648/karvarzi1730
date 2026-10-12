import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Building,
  FileCheck,
  PenTool,
  ScrollText,
  SlidersHorizontal,
} from 'lucide-react';
import { TemplateSettings } from '../types';
import { DEFAULT_TEMPLATE_SETTINGS } from '../data/defaultSettings';

interface TemplateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TemplateSettings;
  onSave: (newSettings: TemplateSettings) => void;
}

export const TemplateSettingsModal: React.FC<TemplateSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<TemplateSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'general' | 'officials' | 'rules' | 'footer'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key: keyof TemplateSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRuleChange = (index: number, value: string) => {
    const updated = [...formData.ruleItems];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, ruleItems: updated }));
  };

  const handleAddRule = () => {
    setFormData((prev) => ({
      ...prev,
      ruleItems: [...prev.ruleItems, 'متن بند جدید...'],
    }));
  };

  const handleRemoveRule = (index: number) => {
    if (formData.ruleItems.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      ruleItems: prev.ruleItems.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleResetToDefault = () => {
    if (confirm('آیا مایلید تمام تنظیمات قالب به مقادیر اولیه سند پیش‌فرض بازگردانده شود؟')) {
      setFormData({ ...DEFAULT_TEMPLATE_SETTINGS });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/30 border border-indigo-400/30">
              <SlidersHorizontal className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">تنظیمات دائمی قالب فرم معرفی‌نامه</h2>
              <p className="text-xs text-indigo-200">
                این مشخصات یکبار تنظیم شده و برای کلیه نامه‌ها و چاپ‌ها ذخیره و اعمال می‌شود
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === 'general'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>مشخصات سربرگ و نامه عطف</span>
          </button>

          <button
            onClick={() => setActiveTab('officials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === 'officials'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>مسئولان و امضاکنندگان</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === 'rules'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>بندها و ضوابط نامه ({formData.ruleItems.length} بند)</span>
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 transition ${
              activeTab === 'footer'
                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>پاورقی و احراز هویت</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    سال تحصیلی
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="۱۴۰۵-۱۴۰۶"
                  />
                  <span className="text-[11px] text-slate-400">نمایش در گوشه بالا راست نامه</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عنوان بالای صفحه (ذکر خداوند)
                  </label>
                  <input
                    type="text"
                    value={formData.headerInvocation}
                    onChange={(e) => handleChange('headerInvocation', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="باسمه تعالی"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عنوان اداره کل آموزش و پرورش
                  </label>
                  <input
                    type="text"
                    value={formData.provinceOffice}
                    onChange={(e) => handleChange('provinceOffice', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="اداره کل آموزش و پرورش استان اصفهان"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عنوان ناحیه یا منطقه
                  </label>
                  <input
                    type="text"
                    value={formData.districtTitle}
                    onChange={(e) => handleChange('districtTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="آموزش و پرورش ناحیه ۶"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان شروع نامه (مخاطب اولیه)
                </label>
                <input
                  type="text"
                  value={formData.districtSalutation}
                  onChange={(e) => handleChange('districtSalutation', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="مدیریت محترم ناحیه"
                />
              </div>

              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-xs font-bold text-blue-900 mb-2">اطلاعات نامه عطف اداره کل:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      شماره نامه اداره کل
                    </label>
                    <input
                      type="text"
                      value={formData.referenceLetterNumber}
                      onChange={(e) => handleChange('referenceLetterNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="844/710/1700/05"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      تاریخ نامه اداره کل
                    </label>
                    <input
                      type="text"
                      value={formData.referenceLetterDate}
                      onChange={(e) => handleChange('referenceLetterDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="1405/07/08"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'officials' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  سمت کارشناس مسئول (بالای کادر تایید حراست و مدیریت)
                </label>
                <textarea
                  rows={2}
                  value={formData.officerRoleTitle}
                  onChange={(e) => handleChange('officerRoleTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="کارشناس مسئول فناوری، آمار، توسعه پژوهش و آموزش نیروی انسانی ناحیه ۶ اصفهان"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">امضاکننده اصلی (سمت چپ نامه - در هر دو نسخه)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      نام و نام خانوادگی مدیر
                    </label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => handleChange('managerName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="منصور فتحی"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      سمت رسمی مدیر
                    </label>
                    <input
                      type="text"
                      value={formData.managerRole}
                      onChange={(e) => handleChange('managerRole', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="مدیریت آموزش و پرورش ناحیه۶"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">امضاکننده دوم (سمت راست - فقط در نسخه بایگانی)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      عنوان واحد یا کارشناسی
                    </label>
                    <input
                      type="text"
                      value={formData.secondSignerTitle}
                      onChange={(e) => handleChange('secondSignerTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="کارشناسی آموزش"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      زیرنویس امضا
                    </label>
                    <input
                      type="text"
                      value={formData.secondSignerSubtitle}
                      onChange={(e) => handleChange('secondSignerSubtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="مهر و امضا"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  بندهای قانونی زیر عیناً در متن مجوز کارورزی چاپ می‌شوند:
                </p>
                <button
                  onClick={handleAddRule}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن بند جدید</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.ruleItems.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 pt-2 text-xs w-6 shrink-0">/{idx + 1}</span>
                    <textarea
                      rows={2}
                      value={rule}
                      onChange={(e) => handleRuleChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs leading-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleRemoveRule(idx)}
                      disabled={formData.ruleItems.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-30"
                      title="حذف بند"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  مدرک ارائه شده جهت احراز هویت
                </label>
                <input
                  type="text"
                  value={formData.identificationDoc}
                  onChange={(e) => handleChange('identificationDoc', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="کارت دانشجویی+معرفی نامه از دانشگاه فرهنگیان"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  متن پاورقی هشدار اعتبار مجوز
                </label>
                <textarea
                  rows={2}
                  value={formData.footerNotice}
                  onChange={(e) => handleChange('footerNotice', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="***این مجوز صرفا با مهر و امضا کارشناسی های آموزش نیروی انسانی ، حراست و مدیریت ناحیه معتبر است."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  خط‌چین پیش‌فرض نام آموزشگاه (در صورت خالی بودن)
                </label>
                <input
                  type="text"
                  value={formData.schoolNamePlaceholder}
                  onChange={(e) => handleChange('schoolNamePlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="......................................"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="includeQrCode"
                  checked={formData.includeQrCode}
                  onChange={(e) => handleChange('includeQrCode', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeQrCode" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  چاپ نوار رهگیری و بارکد امنیتی در انتهای هر برگه
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به سند پیش‌فرض</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              انصراف
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>ذخیره شد!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>ذخیره دائمی تنظیمات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
