import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare, Lightbulb, User, Building, Copy, Check } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const { leads, salesAgents, units, t, lang, openLeadProfile } = useCrm();

  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  // AI-generated pitch simulation
  const pitchAr = `مساء الخير يا فندم يا بشمهندس ${selectedLead?.clientName}، مع حضرتك ${selectedLead?.assignedSalesAgent} مستشارك العقاري في شركة Heaven Real Estate بالإسكندرية.\nبناءً على اهتمام حضرتك بوحدات ${selectedLead?.unitType} في ${selectedLead?.interestedProject} وميزانيتكم المقدرة بنحو ${selectedLead?.budget.toLocaleString()} ج.م، تم تخصيص وحدتين مميزتين بموقع بحري مباشر بنظام دفع استثنائي 10% مقدم وتقسيط حتى 7 سنوات بدون فوائد.\nهل يناسب حضرتك نلتقي غداً في فرعنا بكفر عبده لمراجعة المخططات الهندسية قبل إغلاق الحجز؟`;

  const pitchEn = `Good afternoon Eng. ${selectedLead?.clientName}, this is ${selectedLead?.assignedSalesAgent} from Heaven Real Estate Alexandria.\nFollowing up on your interest in ${selectedLead?.unitType} at ${selectedLead?.interestedProject} within the ${selectedLead?.budget.toLocaleString()} EGP range, we have selected 2 prime sea-view units with a special 10% down payment and 7-year equal installment plan.\nWould you prefer meeting at our Kafr Abdo office tomorrow to review floorplans?`;

  const currentPitch = lang === 'ar' ? pitchAr : pitchEn;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiInsights = [
    {
      type: 'high_probability',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      titleAr: 'احتمالية شراء مرتفعة جداً (95%)',
      titleEn: 'High Buying Probability (95%)',
      descAr: 'العميل "محمد علي" زار المقر واستفسر عن تفاصيل العقد 3 مرات. نوصي بالإغلاق النهائي اليوم.',
      descEn: 'Mohamed Ali visited Kafr Abdo branch and reviewed contract 3 times. Recommended to close deal today.'
    },
    {
      type: 'bottleneck',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      titleAr: 'عميل تم التواصل معه 4 مرات بدون تحديد موعد معاينة',
      titleEn: 'Contacted 4 times without scheduling site visit',
      descAr: 'العميل "أحمد حسن" مستجيب ولكنه متردد في الزيارة. نوصي بعرض خدمة الانتقال المجانية لمعاينة سواري.',
      descEn: 'Client Ahmed Hassan is responsive but hesitant. Suggest offering executive car transport to Sawari site.'
    },
    {
      type: 'matching',
      icon: Lightbulb,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      titleAr: 'ميزانية العميل تطابق 6 وحدات متاحة بالمخزون',
      titleEn: 'Client budget matches 6 available inventory units',
      descAr: 'ميزانية "د. طارق الشناوي" (9M ج.م) تناسب دوبلكس سواري ووحدات بالم هيلز الفاخرة.',
      descEn: 'Client budget fits both Sawari duplexes and Palm Hills Alexandria residences.'
    },
    {
      type: 'sla_warning',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-800 border-red-200',
      titleAr: 'مسؤول المبيعات لديه 8 متابعات متأخرة',
      titleEn: 'Sales Agent has 8 overdue follow-ups',
      descAr: 'تحذير لمدير المبيعات: تراكم المتابعات لدى وكيل المبيعات يهدد تسريب الفرص للمنافسين.',
      descEn: 'Warning for Sales Manager: agent backlog risks losing buyers to competitors.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.aiAssistantTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-amber-900 border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Predictive Intelligence</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.aiAssistantSubtitle}
          </p>
        </div>
      </div>

      {/* 4 Core AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-3xl border shadow-xs transition-all ${insight.color}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm">
                    {lang === 'ar' ? insight.titleAr : insight.titleEn}
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {lang === 'ar' ? insight.descAr : insight.descEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Egyptian Luxury Real Estate Pitch Generator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.generatePitch}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'توليد سيناريو إقناع بيعي مخصص للعميل بأسلوب راقٍ ومناسب للمشتري السكندري'
                : 'Custom real estate sales script crafted for Alexandria & North Coast luxury buyers'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{t.clientName}:</span>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.clientName} ({l.interestedProject})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pitch Content Box */}
        <div className="relative bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
            {currentPitch}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'ar' ? 'يمكن نسخه مباشرة واستخدامه في المكالمة أو الواتساب' : 'Ready to use on call or WhatsApp'}
            </span>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ السيناريو' : 'Copy Pitch')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
