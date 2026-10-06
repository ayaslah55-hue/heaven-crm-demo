import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  PhoneCall, Phone, PhoneForwarded, Clock, 
  CheckCircle2, XCircle, Search, Filter, 
  Download, Sparkles, Building, User, Radio
} from 'lucide-react';

export const CallsManager: React.FC = () => {
  const { calls, t, lang, openCallModal, leads, openLeadProfile } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredCalls = calls.filter((c) => {
    if (filterStatus !== 'ALL' && c.callStatus !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        c.clientName.toLowerCase().includes(q) ||
        c.clientPhone.includes(q) ||
        c.salesAgent.toLowerCase().includes(q) ||
        c.callNotes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCalls = calls.length;
  const answeredCount = calls.filter((c) => c.callStatus === 'Answered').length;
  const noAnswerCount = calls.filter((c) => ['No Answer', 'Busy'].includes(c.callStatus)).length;
  const totalDurationSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const avgDurationMinutes = (totalDurationSeconds / (answeredCount || 1) / 60).toFixed(1);

  const exportCsv = () => {
    const headers = ['Client Name', 'Phone', 'Sales Agent', 'Date', 'Time', 'Duration (sec)', 'Status', 'Notes', 'Next Action'];
    const rows = filteredCalls.map((c) => [
      `"${c.clientName}"`,
      `"${c.clientPhone}"`,
      `"${c.salesAgent}"`,
      `"${c.callDate}"`,
      `"${c.callTime}"`,
      c.durationSeconds,
      `"${c.callStatus}"`,
      `"${c.callNotes}"`,
      `"${c.nextAction}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heaven_crm_sales_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Strictly titled "تقارير السيلز" */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              {t.salesReportsTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20">
              {totalCalls} {lang === 'ar' ? 'تقرير اتصال' : 'Reports'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.salesReportsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={() => openCallModal(leads[0])}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            <span>{t.simulateCall}</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 mb-1">{lang === 'ar' ? 'إجمالي تقارير الاتصال' : 'Total Outreach Calls'}</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCalls}</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {lang === 'ar' ? 'متابعة مباشرة عبر السيلز' : 'Logged via Sales'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 mb-1">{t.callAnswered}</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">{answeredCount}</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            {Math.round((answeredCount / (totalCalls || 1)) * 100)}% {lang === 'ar' ? 'نسبة الاستجابة' : 'Answer rate'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 mb-1">{t.callNoAnswer} / {t.callBusy}</div>
          <div className="text-xl sm:text-2xl font-black text-rose-700">{noAnswerCount}</div>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">
            {lang === 'ar' ? 'تتطلب إعادة الاتصال' : 'Requires callback'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 mb-1">{lang === 'ar' ? 'متوسط مدة المكالمة' : 'Avg Duration'}</div>
          <div className="text-xl sm:text-2xl font-black text-amber-900">{avgDurationMinutes} <span className="text-xs">{lang === 'ar' ? 'دقيقة' : 'min'}</span></div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            {lang === 'ar' ? 'محادثات استكشافية ومبيعات' : 'Per answered call'}
          </span>
        </div>
      </div>

      {/* Telecom Integration Placeholder Banner */}
      <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'ربط السنترال المؤسسي والخطوط الساخنة (Vodafone Business / Twilio)' : 'Enterprise PBX & VoIP Telephony Gateway'}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">READY</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {lang === 'ar'
                ? 'المنظومة مهيأة للتكامل التلقائي مع خطوط شركة Heaven Real Estate لتسجيل المكالمات وإظهار رقم المتصل تلقائياً'
                : 'Configured for CTI caller-ID popup, automatic recording sync, and agent extension routing'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث باسم العميل، الهاتف، أو مسؤول المبيعات...' : 'Search by client, phone, or agent...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="ALL">{lang === 'ar' ? 'جميع النتائج' : 'All Outcomes'}</option>
            <option value="Answered">{t.callAnswered}</option>
            <option value="No Answer">{t.callNoAnswer}</option>
            <option value="Busy">{t.callBusy}</option>
            <option value="Call Back Later">{t.callCallBackLater}</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start">{t.clientName}</th>
                <th className="px-4 py-3 text-start">{t.phoneNumber}</th>
                <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'تاريخ ووقت المكالمة' : 'Date & Time'}</th>
                <th className="px-4 py-3 text-start">{t.callDuration}</th>
                <th className="px-4 py-3 text-start">{t.callStatus}</th>
                <th className="px-4 py-3 text-start">{t.callNotes}</th>
                <th className="px-4 py-3 text-start">{t.nextAction}</th>
                <th className="px-4 py-3 text-end">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCalls.map((call) => {
                const targetLead = leads.find((l) => l.id === call.leadId) || leads[0];
                return (
                  <tr key={call.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div
                        onClick={() => openLeadProfile(targetLead)}
                        className="hover:text-amber-700 cursor-pointer"
                      >
                        {call.clientName}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600" dir="ltr">
                      {call.clientPhone}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {call.salesAgent}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {call.callDate} • {call.callTime}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {call.durationSeconds > 0 ? `${Math.round(call.durationSeconds / 60)} د (${call.durationSeconds} ث)` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          call.callStatus === 'Answered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : call.callStatus === 'Busy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {call.callStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {call.callNotes}
                    </td>
                    <td className="px-4 py-3 text-amber-900 font-semibold max-w-xs truncate">
                      {call.nextAction}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => openCallModal(targetLead)}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        title={t.quickCall}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
