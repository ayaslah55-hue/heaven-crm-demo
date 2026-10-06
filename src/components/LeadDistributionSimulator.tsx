import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  GitFork, Flame, CheckCircle2, ArrowDown, 
  Clock, Bell, User, Building, Sparkles, Play
} from 'lucide-react';

export const LeadDistributionSimulator: React.FC = () => {
  const { simulateLeadDistribution, t, lang, projects, salesAgents } = useCrm();

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [clientName, setClientName] = useState('Eng. Mahmoud Badr');
  const [source, setSource] = useState('Facebook Lead Ads');
  const [project, setProject] = useState('Sawari New Alexandria');
  const [assignedResult, setAssignedResult] = useState<string | null>(null);

  const steps = [
    {
      num: 1,
      titleAr: 'وصول ليد جديد من حملة Meta / Facebook Ads',
      titleEn: 'New Inbound Lead from Meta Ads Webhook',
      descAr: 'استلام بيانات العميل اللحظية عبر الـ API (الاسم، الهاتف، الميزانية، المشروع المهتم به)',
      descEn: 'Capturing real-time payload: Name, mobile, budget, project parameter'
    },
    {
      num: 2,
      titleAr: 'فحص مصفوفة السيلز ونظام Round-Robin العادل',
      titleEn: 'Evaluating Sales Team Availability & Workload',
      descAr: 'فحص استيعاب مسؤولي المبيعات المتاحين والتوجيه العادل لمن لديه أقل عدد ليدات',
      descEn: 'Balancing active assignments using round-robin logic & specialty matches'
    },
    {
      num: 3,
      titleAr: 'تخصيص العميل آلياً وإرسال إشعار فوري',
      titleEn: 'Lead Auto-Assigned & Instant Push Alert Dispatched',
      descAr: 'تحديث بيانات العميل بالمنظومة وإرسال إشعار داخلي لمسؤول المبيعات المختار',
      descEn: 'Assigned to sales consultant with instant CRM bell notification'
    },
    {
      num: 4,
      titleAr: 'جدولة مهمة اتصال عاجلة تلقائياً (SLA: 15 دقيقة)',
      titleEn: 'Automated 15-Minute Follow-up Task Scheduled',
      descAr: 'إنشاء مهمة اتصال أولى بجدول المتابعات مع تفعيل عداد الـ SLA لضمان سرعة التواصل',
      descEn: 'Follow-up created in Outreach Queue with 15-min speed-to-call countdown'
    }
  ];

  const runSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setAssignedResult(null);

    await new Promise((r) => setTimeout(r, 900));
    setCurrentStep(2);

    await new Promise((r) => setTimeout(r, 1100));
    setCurrentStep(3);
    const res = await simulateLeadDistribution(source, clientName, project, 6500000);
    setAssignedResult(res.assignedAgent);

    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(4);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.leadDistributionTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Live Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.leadDistributionSubtitle}
          </p>
        </div>
      </div>

      {/* Simulator Control Box */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <h3 className="font-extrabold text-sm text-white mb-2 flex items-center gap-2">
          <Play className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? 'إعدادات تشغيل التجربة الحية' : 'Simulation Parameters'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs my-4">
          <div>
            <label className="text-slate-400 font-bold block mb-1">{t.clientName}</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">{t.leadSource}</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              <option value="Facebook">Facebook Lead Ads</option>
              <option value="Instagram">Instagram Reels Campaign</option>
              <option value="Website">Official Website Inbound Form</option>
              <option value="Property Portal">Property Finder Portal</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">{t.interestedProject}</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <span>{lang === 'ar' ? 'جاري محاكاة التوزيع بالخوارزمية...' : 'Simulating Distribution Engine...'}</span>
          ) : (
            <>
              <Flame className="w-4 h-4 text-slate-950" />
              <span>{t.simulateNewAdLead}</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Workflow Steps */}
      <div className="space-y-4">
        {steps.map((st) => {
          const isPassed = currentStep >= st.num;
          const isCurrent = currentStep === st.num;
          return (
            <div
              key={st.num}
              className={`p-5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                  : isPassed
                  ? 'bg-white border-emerald-300'
                  : 'bg-white/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : st.num}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {lang === 'ar' ? st.titleAr : st.titleEn}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 animate-pulse">
                        {lang === 'ar' ? 'جاري التنفيذ...' : 'Processing...'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ar' ? st.descAr : st.descEn}
                  </p>

                  {st.num === 3 && assignedResult && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'ar' ? `تم إسناد العميل بنجاح إلى: ${assignedResult}` : `Assigned to: ${assignedResult}`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
