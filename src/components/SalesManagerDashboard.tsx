import React from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  AlertTriangle, ShieldAlert, Clock, TrendingUp, 
  DollarSign, Users, ChevronRight, UserX, Award, 
  Flame, CheckCircle2, PhoneCall
} from 'lucide-react';

export const SalesManagerDashboard: React.FC = () => {
  const { leads, followUps, salesAgents, t, lang, setActiveTab, openLeadProfile } = useCrm();

  const uncontactedLeads = leads.filter(
    (l) => l.leadStatus === 'New Lead' || l.lastContactDate < '2026-10-05'
  );

  const overdueFollowUps = followUps.filter(
    (f) => f.status === 'Pending' && (f.followUpDate < '2026-10-06' || f.priority === 'Urgent')
  );

  const highValueNoNext = leads.filter(
    (l) => l.budget >= 7000000 && !l.nextFollowUpDate && l.leadStatus !== 'Closed Deal'
  );

  const negotiationDeals = leads.filter((l) => l.leadStatus === 'Negotiation');
  const pipelineValue = negotiationDeals.reduce((acc, l) => acc + l.budget, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.salesManagerTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
              SLA Control Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.salesManagerSubtitle}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('autodistribution')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? 'إعادة ضبط قواعد التوزيع' : 'Rebalance Leads Routing'}</span>
        </button>
      </div>

      {/* 3 Prominent SLA Alert Banners (as requested) */}
      <div className="space-y-3">
        {/* Alert 1: Uncontacted Leads */}
        <div className="bg-gradient-to-r from-red-500/10 via-rose-50 to-white border border-red-300/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-red-950">
                ⚠️ {uncontactedLeads.length} {t.uncontactedLeadsAlert}
              </div>
              <p className="text-[11px] text-red-800 mt-0.5">
                {lang === 'ar'
                  ? 'تأخر الاستجابة يقلل من فرصة الإغلاق بنسبة 70%. مطلوب تحويلهم أو إجراء مكالمات فورية.'
                  : 'Response delay reduces closing rates drastically. Require immediate agent dispatch.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'معالجة فورية' : 'Act Now'}
          </button>
        </div>

        {/* Alert 2: Overdue Followups */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-300/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-md shadow-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-amber-950">
                ⚠️ {overdueFollowUps.length} {t.overdueFollowupsAlert}
              </div>
              <p className="text-[11px] text-amber-900 mt-0.5">
                {lang === 'ar'
                  ? 'مواعيد متابعة مجدولة تخطت الوقت المحدد بدون تدوين تقرير السيلز.'
                  : 'Follow-ups past due without call report logs.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('followups')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'فحص المتأخرات' : 'Inspect Queue'}
          </button>
        </div>

        {/* Alert 3: High Value Clients No Next Action */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-indigo-50 to-white border border-indigo-300/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-indigo-950">
                💎 {highValueNoNext.length} {t.highValueNoNextAction}
              </div>
              <p className="text-[11px] text-indigo-900 mt-0.5">
                {lang === 'ar'
                  ? 'عملاء الصفوة بميزانيات تفوق 7 مليون ج.م بدون خطوة متابعة مستقبلية مسجلة.'
                  : 'VIP buyers (>7M EGP) pending next scheduled touchpoint.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'تعيين خطوة' : 'Assign Steps'}
          </button>
        </div>
      </div>

      {/* Pipeline Value and Negotiation Volume */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {t.pipelineValue}
          </span>
          <div className="text-2xl font-black text-amber-900">
            {(pipelineValue / 1000000).toFixed(1)} <span className="text-xs">{lang === 'ar' ? 'مليون ج.م' : 'M EGP'}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {negotiationDeals.length} {lang === 'ar' ? 'عميل في مرحلة التفاوض النهائي' : 'prospects in active negotiation'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {lang === 'ar' ? 'معدل الالتزام بالمتابعات (SLA)' : 'Follow-up SLA Compliance'}
          </span>
          <div className="text-2xl font-black text-emerald-700">92.4%</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            ↑ +4% {lang === 'ar' ? 'تحسن في الربع الحالي' : 'improvement this quarter'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {lang === 'ar' ? 'متوسط وقت أول اتصال للعميل' : 'Speed to First Call'}
          </span>
          <div className="text-2xl font-black text-slate-900">18 <span className="text-xs">{lang === 'ar' ? 'دقيقة' : 'mins'}</span></div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {lang === 'ar' ? 'المستهدف: أقل من 15 دقيقة' : 'Target: under 15 mins'}
          </span>
        </div>
      </div>

      {/* Agent Performance Workload Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-black text-xs text-slate-900 mb-3">
          {lang === 'ar' ? 'توزيع عبء العمل والعملاء غير المتواصل معهم لكل سيلز' : 'Agent Workload & Uncontacted Distribution'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {salesAgents.map((ag) => {
            const agentUncontacted = uncontactedLeads.filter((l) => l.assignedSalesAgent === ag.name).length;
            return (
              <div key={ag.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <img src={ag.avatar} alt={ag.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{ag.name}</div>
                    <div className="text-[10px] text-slate-400">{ag.assignedLeads} leads</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'متأخرات:' : 'Overdue:'}</span>
                    <span className={`font-bold ${agentUncontacted > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {agentUncontacted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{lang === 'ar' ? 'المبيعات:' : 'Volume:'}</span>
                    <span className="font-bold text-slate-800">{(ag.salesValue / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
