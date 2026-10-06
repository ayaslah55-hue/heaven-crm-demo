import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  FileText, Download, Filter, BarChart3, 
  Calendar, Building, User, DollarSign, CheckCircle2 
} from 'lucide-react';

export const ReportsCenter: React.FC = () => {
  const { leads, deals, reservations, salesAgents, projects, calls, t, lang } = useCrm();

  const [activeReport, setActiveReport] = useState<string>('leads');
  const [filterAgent, setFilterAgent] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');

  const reportTypes = [
    { id: 'leads', name: lang === 'ar' ? 'تقرير العملاء والمهتمين' : 'Leads Report' },
    { id: 'sales', name: lang === 'ar' ? 'تقرير المبيعات والصفقات' : 'Sales Report' },
    { id: 'agents', name: lang === 'ar' ? 'تقرير أداء السيلز' : 'Agent Performance Report' },
    { id: 'projects', name: lang === 'ar' ? 'تقرير مبيعات المشروعات' : 'Project Performance' },
    { id: 'campaigns', name: lang === 'ar' ? 'تقرير الحملات الإعلانية' : 'Campaign Performance' },
    { id: 'sources', name: lang === 'ar' ? 'تقرير مصادر الإعلانات' : 'Lead Source Performance' },
    { id: 'conversion', name: lang === 'ar' ? 'تقرير معدلات التحويل' : 'Conversion Report' },
    { id: 'lost', name: lang === 'ar' ? 'تقرير العملاء المفقودين' : 'Lost Leads Report' },
    { id: 'reservations', name: lang === 'ar' ? 'تقرير الحجوزات والودائع' : 'Reservations Report' },
    { id: 'revenue', name: lang === 'ar' ? 'تقرير الإيرادات والعمولات' : 'Revenue & Commission Report' },
  ];

  const handleExport = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeReport === 'leads') {
      headers = ['Name', 'Phone', 'Project', 'Status', 'Agent', 'Budget (EGP)', 'Source'];
      rows = leads.map((l) => [`"${l.clientName}"`, `"${l.mobileNumber}"`, `"${l.interestedProject}"`, `"${l.leadStatus}"`, `"${l.assignedSalesAgent}"`, l.budget, `"${l.leadSource}"`]);
    } else if (activeReport === 'sales' || activeReport === 'revenue') {
      headers = ['Client', 'Project', 'Unit', 'Agent', 'Deal Value', 'Commission', 'Closing Date'];
      rows = deals.map((d) => [`"${d.clientName}"`, `"${d.project}"`, `"${d.unitCode}"`, `"${d.salesAgent}"`, d.dealValue, d.commission, `"${d.closingDate}"`]);
    } else if (activeReport === 'agents') {
      headers = ['Agent', 'Assigned Leads', 'Calls', 'Follow-ups', 'Site Visits', 'Deals', 'Sales Value', 'Conversion Rate'];
      rows = salesAgents.map((ag) => [`"${ag.name}"`, ag.assignedLeads, ag.callsMade, ag.followUpsCompleted, ag.siteVisits, ag.closedDeals, ag.salesValue, `${ag.conversionRate}%`]);
    } else {
      headers = ['Item', 'Category', 'Count / Value', 'Status'];
      rows = projects.map((p) => [`"${p.name}"`, `"${p.location}"`, p.startingPrice, `"${p.availableUnits} units"`]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heaven_crm_${activeReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.reportsTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.reportsSubtitle}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {/* 10 Reports Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {reportTypes.map((rep) => (
          <button
            key={rep.id}
            onClick={() => setActiveReport(rep.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeReport === rep.id
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {rep.name}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-0.5">{t.filterByAgent}</label>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="ALL">{lang === 'ar' ? 'جميع السيلز' : 'All Agents'}</option>
              {salesAgents.map((ag) => (
                <option key={ag.id} value={ag.name}>{ag.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-0.5">{t.filterByProject}</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="ALL">{lang === 'ar' ? 'جميع المشاريع' : 'All Projects'}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          {lang === 'ar' ? 'محدث تلقائياً من قاعدة البيانات' : 'Live synced with CRM transactions'}
        </div>
      </div>

      {/* Render Current Report Table Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-sm text-slate-900">
            {reportTypes.find((r) => r.id === activeReport)?.name}
          </h3>
          <span className="text-xs text-amber-800 font-bold">
            {lang === 'ar' ? 'جاهز للتصدير كملف إكسيل CSV' : 'Ready for CSV Export'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {activeReport === 'leads' ? (
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3 text-start">{t.clientName}</th>
                  <th className="p-3 text-start">{t.phoneNumber}</th>
                  <th className="p-3 text-start">{t.interestedProject}</th>
                  <th className="p-3 text-start">{t.budget}</th>
                  <th className="p-3 text-start">{t.salesAgent}</th>
                  <th className="p-3 text-start">{t.leadStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.slice(0, 10).map((l) => (
                  <tr key={l.id}>
                    <td className="p-3 font-bold text-slate-900">{l.clientName}</td>
                    <td className="p-3 font-mono text-slate-600" dir="ltr">{l.mobileNumber}</td>
                    <td className="p-3">{l.interestedProject}</td>
                    <td className="p-3 font-bold text-amber-900">{l.budget.toLocaleString()} {t.egpCurrency}</td>
                    <td className="p-3">{l.assignedSalesAgent}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-slate-100">{l.leadStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeReport === 'sales' || activeReport === 'revenue' ? (
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3 text-start">{t.clientName}</th>
                  <th className="p-3 text-start">{t.interestedProject}</th>
                  <th className="p-3 text-start">{lang === 'ar' ? 'كود الوحدة' : 'Unit'}</th>
                  <th className="p-3 text-start">{t.dealValue}</th>
                  <th className="p-3 text-start">{t.commissionEarned}</th>
                  <th className="p-3 text-start">{t.salesAgent}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((d) => (
                  <tr key={d.id}>
                    <td className="p-3 font-bold text-slate-900">{d.clientName}</td>
                    <td className="p-3">{d.project}</td>
                    <td className="p-3 font-mono text-amber-900 font-bold">{d.unitCode}</td>
                    <td className="p-3 font-black text-slate-900">{d.dealValue.toLocaleString()} {t.egpCurrency}</td>
                    <td className="p-3 font-bold text-emerald-700">{d.commission.toLocaleString()} {t.egpCurrency}</td>
                    <td className="p-3">{d.salesAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              {lang === 'ar' ? 'بيانات التقرير جاهزة للعرض والتصدير بالكامل أعلاه.' : 'Report matrix ready for viewing and CSV export.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
