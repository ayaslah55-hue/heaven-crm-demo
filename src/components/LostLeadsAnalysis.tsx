import React from 'react';
import { useCrm } from '../context/CrmContext';
import { LossReason } from '../types/crm';
import { UserX, RefreshCw, AlertCircle, PieChart, TrendingDown, CheckCircle2 } from 'lucide-react';

export const LostLeadsAnalysis: React.FC = () => {
  const { leads, reviveLead, t, lang, openLeadProfile } = useCrm();

  const lostLeads = leads.filter((l) => l.leadStatus === 'Lost Lead');

  // Breakdown by reasons
  const reasonCounts: Record<string, number> = {};
  lostLeads.forEach((l) => {
    const reason = l.lossReason || 'Other';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  // Breakdown by Agent
  const agentLostCounts: Record<string, number> = {};
  lostLeads.forEach((l) => {
    agentLostCounts[l.assignedSalesAgent] = (agentLostCounts[l.assignedSalesAgent] || 0) + 1;
  });

  // Breakdown by Source
  const sourceLostCounts: Record<string, number> = {};
  lostLeads.forEach((l) => {
    sourceLostCounts[l.leadSource] = (sourceLostCounts[l.leadSource] || 0) + 1;
  });

  // Breakdown by Project
  const projectLostCounts: Record<string, number> = {};
  lostLeads.forEach((l) => {
    projectLostCounts[l.interestedProject] = (projectLostCounts[l.interestedProject] || 0) + 1;
  });

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'Price': return t.reasonPrice;
      case 'No Response': return t.reasonNoResponse;
      case 'Competitor': return t.reasonCompetitor;
      case 'Location': return t.reasonLocation;
      case 'Payment Plan': return t.reasonPaymentPlan;
      case 'Not Ready': return t.reasonNotReady;
      case 'Invalid Lead': return t.reasonInvalidLead;
      case 'Changed Decision': return t.reasonChangedDecision;
      default: return reason;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.lostLeadsTitle}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
              {lostLeads.length} {lang === 'ar' ? 'عميل ملغي' : 'Lost Leads'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.lostLeadsSubtitle}
          </p>
        </div>
      </div>

      {/* 4 Analytical Diagnostic Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Reason Breakdown */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 mb-3">
            {lang === 'ar' ? 'أكثر أسباب الفقدان شيوعاً' : 'Most Common Loss Reasons'}
          </h3>
          <div className="space-y-2.5">
            {Object.entries(reasonCounts).map(([reason, count]) => {
              const pct = Math.round((count / (lostLeads.length || 1)) * 100);
              return (
                <div key={reason}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">{getReasonLabel(reason)}</span>
                    <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Lost by Agent */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 mb-3">
            {lang === 'ar' ? 'العملاء المفقودون لكل سيلز' : 'Leads Lost by Sales Agent'}
          </h3>
          <div className="space-y-2.5">
            {Object.entries(agentLostCounts).map(([ag, count]) => {
              const pct = Math.round((count / (lostLeads.length || 1)) * 100);
              return (
                <div key={ag}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{ag}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Lost by Source */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 mb-3">
            {lang === 'ar' ? 'الفقدان حسب المصدر الإعلاني' : 'Lost by Lead Source'}
          </h3>
          <div className="space-y-2.5">
            {Object.entries(sourceLostCounts).map(([src, count]) => {
              const pct = Math.round((count / (lostLeads.length || 1)) * 100);
              return (
                <div key={src}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{src}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Lost by Project */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 mb-3">
            {lang === 'ar' ? 'الفقدان حسب المشروع' : 'Lost by Project'}
          </h3>
          <div className="space-y-2.5">
            {Object.entries(projectLostCounts).map(([proj, count]) => {
              const pct = Math.round((count / (lostLeads.length || 1)) * 100);
              return (
                <div key={proj}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 truncate max-w-[130px]">{proj}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lost Leads Table with 1-click Revival */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-black text-xs text-slate-900">
            {lang === 'ar' ? 'قائمة العملاء المفقودين وإمكانية إعادة التفعيل' : 'Lost Leads Roster & Pipeline Revival'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start">{t.clientName}</th>
                <th className="px-4 py-3 text-start">{t.phoneNumber}</th>
                <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                <th className="px-4 py-3 text-start">{t.lossReason}</th>
                <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                <th className="px-4 py-3 text-start">{t.notes}</th>
                <th className="px-4 py-3 text-end">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lostLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div
                      onClick={() => openLeadProfile(lead)}
                      className="hover:text-amber-700 cursor-pointer"
                    >
                      {lead.clientName}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600" dir="ltr">
                    {lead.mobileNumber}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    {lead.interestedProject}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {getReasonLabel(lead.lossReason || 'Other')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {lead.assignedSalesAgent}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                    {lead.lossNotes || lead.notes}
                  </td>
                  <td className="px-4 py-3.5 text-end">
                    <button
                      onClick={() => {
                        reviveLead(lead.id);
                        alert(lang === 'ar' ? `تمت إعادة إحياء العميل "${lead.clientName}" إلى البايب لاين بنجاح!` : `Lead ${lead.clientName} revived to active pipeline!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center gap-1.5 ms-auto transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      <span>{t.reviveLead}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
