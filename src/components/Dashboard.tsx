import React from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  Users, UserCheck, Calendar, MapPin, 
  BadgePercent, Award, TrendingUp, PhoneCall, 
  MessageSquare, AlertCircle, ArrowUpRight, DollarSign,
  Briefcase, CheckCircle2, ChevronRight, Clock, Building2, Flame
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    t, lang, leads, followUps, reservations, deals, 
    salesAgents, projects, openCallModal, openWhatsAppModal, 
    openLeadProfile, setActiveTab 
  } = useCrm();

  // Metrics calculations
  const totalLeads = leads.length;
  const newLeadsToday = leads.filter((l) => l.createdAt === '2026-10-06' || l.leadStatus === 'New Lead').length;
  const activeLeads = leads.filter((l) => !['Closed Deal', 'Lost Lead'].includes(l.leadStatus)).length;
  const qualifiedLeads = leads.filter((l) => ['Qualified', 'Negotiation', 'Reservation'].includes(l.leadStatus)).length;
  
  const todayFollowUpsList = followUps.filter(
    (f) => f.status === 'Pending' && (f.followUpDate === '2026-10-06' || f.priority === 'Urgent')
  );
  const followUpsToday = todayFollowUpsList.length;

  const meetingsScheduled = 12; // aggregate from schedule
  const activeReservations = reservations.filter((r) => r.reservationStatus === 'Active').length;
  const closedDealsCount = deals.length;
  const lostLeadsCount = leads.filter((l) => l.leadStatus === 'Lost Lead').length;
  
  const totalSalesValue = deals.reduce((acc, d) => acc + d.dealValue, 0);
  const conversionRate = Number(((closedDealsCount / (totalLeads || 1)) * 100).toFixed(1));

  // Chart datasets
  // 1. Leads by source
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.leadSource] = (sourceCounts[l.leadSource] || 0) + 1;
  });

  // 2. Leads by Project
  const projectCounts: Record<string, number> = {};
  leads.forEach((l) => {
    projectCounts[l.interestedProject] = (projectCounts[l.interestedProject] || 0) + 1;
  });

  // 3. Leads by Sales Agent
  const agentCounts: Record<string, number> = {};
  leads.forEach((l) => {
    agentCounts[l.assignedSalesAgent] = (agentCounts[l.assignedSalesAgent] || 0) + 1;
  });

  // 4. Monthly sales (in Million EGP)
  const monthlyData = [
    { month: lang === 'ar' ? 'مايو' : 'May', val: 18.2 },
    { month: lang === 'ar' ? 'يونيو' : 'Jun', val: 26.5 },
    { month: lang === 'ar' ? 'يوليو' : 'Jul', val: 34.0 },
    { month: lang === 'ar' ? 'أغسطس' : 'Aug', val: 42.8 },
    { month: lang === 'ar' ? 'سبتمبر' : 'Sep', val: 38.4 },
    { month: lang === 'ar' ? 'أكتوبر' : 'Oct (حالي)', val: 40.7 },
  ];

  // 5. Funnel
  const funnelStages = [
    { label: t.stageNewLead, count: leads.length, pct: 100, color: 'bg-slate-700' },
    { label: t.stageContacted, count: 24, pct: 80, color: 'bg-blue-600' },
    { label: t.stageQualified, count: 18, pct: 60, color: 'bg-amber-600' },
    { label: t.stageMeetingScheduled, count: 12, pct: 40, color: 'bg-indigo-600' },
    { label: t.stageReservation, count: reservations.length, pct: 23, color: 'bg-purple-600' },
    { label: t.stageClosedDeal, count: deals.length, pct: 13, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 end-0 -mt-12 -me-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.alexandriaHQ}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ar' ? 'لوحة القيادة والمؤشرات التنفيذية' : 'Executive Command Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {lang === 'ar'
                ? 'متابعة حية وشاملة لتدفق العملاء والمبيعات ومشاريع الإسكندرية والساحل الشمالي'
                : 'Live unified tracking for leads pipeline, sales teams, and inventory in Alexandria & North Coast'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('autodistribution')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{t.navAutoDistribution}</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.reportsTitle}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 11 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Leads */}
        <div 
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.totalLeads}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalLeads}</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            ↑ 14% {lang === 'ar' ? 'هذا الشهر' : 'vs last month'}
          </span>
        </div>

        {/* 2. New Leads Today */}
        <div 
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.newLeadsToday}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{newLeadsToday}</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
            {lang === 'ar' ? 'من فيسبوك وانستجرام' : 'From Meta & Web'}
          </span>
        </div>

        {/* 3. Active Leads */}
        <div 
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.activeLeads}</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{activeLeads}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {lang === 'ar' ? 'قيد المتابعة الحية' : 'In pipeline'}
          </span>
        </div>

        {/* 4. Qualified Leads */}
        <div 
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.qualifiedLeads}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{qualifiedLeads}</div>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">
            {Math.round((qualifiedLeads / totalLeads) * 100)}% {lang === 'ar' ? 'من الإجمالي' : 'of total'}
          </span>
        </div>

        {/* 5. Follow-ups Today */}
        <div 
          onClick={() => setActiveTab('followups')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-amber-50/50 to-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate text-amber-900">{t.followUpsToday}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              {followUpsToday}
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900">{followUpsToday}</div>
          <span className="text-[10px] text-red-600 font-bold mt-1 block">
            {lang === 'ar' ? 'إجراء عاجل مطلوب' : 'Urgent action required'}
          </span>
        </div>

        {/* 6. Meetings Scheduled */}
        <div 
          onClick={() => setActiveTab('meetings')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.meetingsScheduled}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{meetingsScheduled}</div>
          <span className="text-[10px] text-purple-700 font-semibold mt-1 block">
            {lang === 'ar' ? 'معاينات ومكاتب' : 'Visits & HQ'}
          </span>
        </div>

        {/* 7. Active Reservations */}
        <div 
          onClick={() => setActiveTab('reservations')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.reservationsCount}</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BadgePercent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{activeReservations}</div>
          <span className="text-[10px] text-teal-700 font-semibold mt-1 block">
            {lang === 'ar' ? 'دفعة حجز مسددة' : 'Deposits logged'}
          </span>
        </div>

        {/* 8. Closed Deals */}
        <div 
          onClick={() => setActiveTab('reservations')}
          className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-emerald-50/40 to-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate text-emerald-900">{t.closedDealsCount}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800">{closedDealsCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            {lang === 'ar' ? 'عقود موقعة نهائياً' : 'Legally signed'}
          </span>
        </div>

        {/* 9. Lost Leads */}
        <div 
          onClick={() => setActiveTab('lostleads')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-red-400/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.lostLeadsCount}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{lostLeadsCount}</div>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
            {lang === 'ar' ? 'تحليل أسباب الانسحاب' : 'Click to diagnose'}
          </span>
        </div>

        {/* 10. Total Sales Value */}
        <div 
          onClick={() => setActiveTab('reservations')}
          className="col-span-2 sm:col-span-1 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700 shadow-md cursor-pointer group hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-amber-300 truncate">{t.totalSalesValue}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {(totalSalesValue / 1000000).toFixed(1)} <span className="text-xs text-amber-400 font-bold">{lang === 'ar' ? 'مليون ج.م' : 'M EGP'}</span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium mt-1 block">
            {lang === 'ar' ? 'العقود المكتملة في الربع الحالي' : 'Closed volume in Q4'}
          </span>
        </div>

        {/* 11. Conversion Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold truncate">{t.conversionRate}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{conversionRate}%</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {lang === 'ar' ? 'متوسط أعلى من السوق' : 'Above benchmark'}
          </span>
        </div>
      </div>

      {/* Today's Follow-ups Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                {t.todayFollowUpsTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                {todayFollowUpsList.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{t.todayFollowUpsSubtitle}</p>
          </div>

          <button
            onClick={() => setActiveTab('followups')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{lang === 'ar' ? 'عرض كل المتابعات' : 'View all follow-ups'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-start">{t.clientName}</th>
                <th className="px-4 py-3 text-start">{t.phoneNumber}</th>
                <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                <th className="px-4 py-3 text-start">{t.followUpTime}</th>
                <th className="px-4 py-3 text-start">{t.priority}</th>
                <th className="px-4 py-3 text-end">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayFollowUpsList.slice(0, 5).map((fu) => {
                const targetLead = leads.find((l) => l.id === fu.leadId) || leads[0];
                return (
                  <tr key={fu.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div
                        onClick={() => openLeadProfile(targetLead)}
                        className="font-bold text-slate-900 hover:text-amber-600 cursor-pointer"
                      >
                        {fu.clientName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{fu.notes}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-600 font-mono text-[11px]" dir="ltr">
                      {fu.clientPhone}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                        {fu.interestedProject}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {fu.assignedAgent}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {fu.followUpTime}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          fu.priority === 'Urgent'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : fu.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {fu.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Call */}
                        <button
                          onClick={() => openCallModal(targetLead)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                          title={t.quickCall}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        {/* WhatsApp */}
                        <button
                          onClick={() => openWhatsAppModal(targetLead)}
                          className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-colors cursor-pointer"
                          title={t.quickWhatsApp}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        {/* Profile */}
                        <button
                          onClick={() => openLeadProfile(targetLead)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          {t.viewProfile}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics & Charts Section (6 Visual Charts) */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-black text-slate-900">{t.chartsSectionTitle}</h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'مخططات بيانية تفاعلية لمصادر الإعلانات، أداء السيلز، قمع المبيعات ومشاريع الإسكندرية'
              : 'Interactive real-time visualizations for ads, sales agents, projects & pipeline velocity'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Chart 1: Leads by Source */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.leadsBySource}</h3>
              <span className="text-[10px] text-slate-400 font-bold">{leads.length} Total</span>
            </div>
            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([src, count]) => {
                const pct = Math.round((count / leads.length) * 100);
                return (
                  <div key={src}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{src}</span>
                      <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Leads by Project */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.leadsByProject}</h3>
              <span className="text-[10px] text-slate-400 font-bold">5 Projects</span>
            </div>
            <div className="space-y-3">
              {Object.entries(projectCounts).map(([proj, count]) => {
                const pct = Math.round((count / leads.length) * 100);
                return (
                  <div key={proj}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">{proj}</span>
                      <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Leads by Sales Agent */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.leadsByAgent}</h3>
              <span className="text-[10px] text-slate-400 font-bold">5 Agents</span>
            </div>
            <div className="space-y-3">
              {salesAgents.map((ag) => {
                const count = agentCounts[ag.name] || ag.assignedLeads;
                const pct = Math.round((count / (leads.length || 1)) * 100);
                return (
                  <div key={ag.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {ag.name}
                      </span>
                      <span className="font-bold text-slate-900">{count} Leads</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                        style={{ width: `${Math.min(pct * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Monthly Sales Trend */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.monthlySales}</h3>
              <span className="text-[10px] text-emerald-600 font-bold">↑ +22% Q3</span>
            </div>
            <div className="flex items-end justify-between h-40 pt-4 gap-2 border-b border-slate-100">
              {monthlyData.map((d, i) => {
                const maxVal = 50;
                const heightPct = Math.round((d.val / maxVal) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.val}M
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-slate-900 to-amber-500 rounded-t-lg transition-all group-hover:brightness-110"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 truncate w-full text-center">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 5: Conversion Funnel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.conversionFunnel}</h3>
              <span className="text-[10px] text-slate-400 font-bold">Full Cycle</span>
            </div>
            <div className="space-y-2.5">
              {funnelStages.map((st, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-semibold text-slate-700">{st.label}</span>
                    <span className="font-bold text-slate-900">{st.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${st.color} rounded-full`}
                      style={{ width: `${st.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 6: Sales Performance vs Target */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-xs text-slate-900">{t.salesPerformance}</h3>
              <span className="text-[10px] text-amber-700 font-bold">EGP Volume</span>
            </div>
            <div className="space-y-3">
              {salesAgents.slice(0, 4).map((ag) => {
                const targetM = ag.targetValue / 1000000;
                const salesM = ag.salesValue / 1000000;
                const pct = Math.min(Math.round((salesM / targetM) * 100), 100);
                return (
                  <div key={ag.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{ag.name}</span>
                      <span className="text-[11px] font-bold text-amber-800">
                        {salesM.toFixed(1)}M / {targetM.toFixed(1)}M ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
