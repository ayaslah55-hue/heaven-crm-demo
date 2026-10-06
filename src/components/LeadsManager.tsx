import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Lead, LeadStatus, LeadSource } from '../types/crm';
import { 
  Plus, Search, Filter, Kanban, List, PhoneCall, 
  MessageSquare, User, MoreVertical, Download, 
  ArrowUpDown, Calendar, DollarSign, Building, 
  CheckCircle, Clock, ChevronRight, Eye
} from 'lucide-react';

export const LeadsManager: React.FC = () => {
  const { 
    t, lang, leads, updateLeadStatus, openLeadProfile, 
    openCallModal, openWhatsAppModal, setIsNewLeadModalOpen, 
    projects, salesAgents 
  } = useCrm();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterAgent, setFilterAgent] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Pipeline stages for Kanban
  const pipelineStages: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'New Lead', label: t.stageNewLead, color: 'border-t-blue-500' },
    { id: 'Contacted', label: t.stageContacted, color: 'border-t-sky-500' },
    { id: 'Interested', label: t.stageInterested, color: 'border-t-amber-500' },
    { id: 'Qualified', label: t.stageQualified, color: 'border-t-amber-600' },
    { id: 'Meeting Scheduled', label: t.stageMeetingScheduled, color: 'border-t-indigo-500' },
    { id: 'Site Visit', label: t.stageSiteVisit, color: 'border-t-purple-500' },
    { id: 'Negotiation', label: t.stageNegotiation, color: 'border-t-rose-500' },
    { id: 'Reservation', label: t.stageReservation, color: 'border-t-emerald-500' },
    { id: 'Closed Deal', label: t.stageClosedDeal, color: 'border-t-teal-600' },
    { id: 'Follow-up Later', label: t.stageFollowUpLater, color: 'border-t-slate-400' },
    { id: 'Lost Lead', label: t.stageLostLead, color: 'border-t-red-600' },
  ];

  // Filtering leads
  const filteredLeads = leads.filter((lead) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.clientName.toLowerCase().includes(q) ||
        lead.mobileNumber.includes(q) ||
        lead.interestedProject.toLowerCase().includes(q) ||
        lead.assignedSalesAgent.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterProject !== 'ALL' && lead.interestedProject !== filterProject) return false;
    if (filterAgent !== 'ALL' && lead.assignedSalesAgent !== filterAgent) return false;
    if (filterSource !== 'ALL' && lead.leadSource !== filterSource) return false;
    if (filterStatus !== 'ALL' && lead.leadStatus !== filterStatus) return false;
    return true;
  });

  // Drag and drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: LeadStatus) => {
    if (draggedLeadId) {
      updateLeadStatus(draggedLeadId, stage);
      setDraggedLeadId(null);
    }
  };

  const exportCsv = () => {
    const headers = ['Client Name', 'Mobile', 'Project', 'Status', 'Agent', 'Budget (EGP)', 'Source', 'Next Followup'];
    const rows = filteredLeads.map((l) => [
      `"${l.clientName}"`,
      `"${l.mobileNumber}"`,
      `"${l.interestedProject}"`,
      `"${l.leadStatus}"`,
      `"${l.assignedSalesAgent}"`,
      l.budget,
      `"${l.leadSource}"`,
      `"${l.nextFollowUpDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heaven_crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navLeads}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20">
              {filteredLeads.length} {lang === 'ar' ? 'عميل' : 'Leads'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'إدارة خط تدفق العملاء المهتمين، تحديث المراحل بالسحب والإفلات، وإجراء المكالمات والواتساب'
              : 'End-to-end sales pipeline, drag-and-drop Kanban progression, telephony and WhatsApp logs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'كانبان' : 'Kanban'}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'جدول' : 'Table'}</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            title={t.exportCsv}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'تصدير' : 'Export'}</span>
          </button>

          {/* Add Lead */}
          <button
            onClick={() => setIsNewLeadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addNewLead}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-amber-500"
          >
            <option value="ALL">{lang === 'ar' ? 'جميع المشاريع' : 'All Projects'}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Agent Filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-amber-500"
          >
            <option value="ALL">{lang === 'ar' ? 'جميع السيلز' : 'All Agents'}</option>
            {salesAgents.map((ag) => (
              <option key={ag.id} value={ag.name}>{ag.name}</option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:border-amber-500"
          >
            <option value="ALL">{lang === 'ar' ? 'جميع المصادر' : 'All Sources'}</option>
            {['Facebook', 'Instagram', 'Website', 'WhatsApp', 'Phone Call', 'Referral', 'Property Portal', 'Walk-in'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(searchQuery || filterProject !== 'ALL' || filterAgent !== 'ALL' || filterSource !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterProject('ALL');
                setFilterAgent('ALL');
                setFilterSource('ALL');
                setFilterStatus('ALL');
              }}
              className="text-[11px] font-bold text-amber-700 hover:underline px-2 py-1"
            >
              {lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 select-none">
          {pipelineStages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.leadStatus === stage.id);
            return (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
                className={`w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border-t-4 border border-slate-200/60 shadow-xs flex flex-col min-h-[600px] transition-colors ${stage.color} ${
                  draggedLeadId ? 'hover:bg-amber-50/50' : ''
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80">
                  <span className="font-extrabold text-xs text-slate-800 truncate">
                    {stage.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-700 shadow-2xs border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[720px] pe-0.5">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div
                          onClick={() => openLeadProfile(lead)}
                          className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          {lead.clientName}
                        </div>
                        {lead.score && (
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                            lead.score >= 90 ? 'bg-emerald-100 text-emerald-800' :
                            lead.score >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {lead.score}%
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mb-1">
                        {lead.interestedProject} • <span className="text-slate-700 font-semibold">{lead.unitType}</span>
                      </div>

                      <div className="text-xs font-black text-amber-900 mb-2">
                        {lead.budget.toLocaleString()} {t.egpCurrency}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                        <span className="truncate max-w-[100px] flex items-center gap-1 font-medium">
                          <User className="w-3 h-3 text-slate-400" />
                          {lead.assignedSalesAgent}
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCallModal(lead);
                            }}
                            className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title={t.quickCall}
                          >
                            <PhoneCall className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsAppModal(lead);
                            }}
                            className="p-1 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                            title={t.quickWhatsApp}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openLeadProfile(lead);
                            }}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title={t.viewProfile}
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200/70 rounded-xl flex items-center justify-center text-[11px] text-slate-400">
                      {lang === 'ar' ? 'اسحب العميل إلى هنا' : 'Drop leads here'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: HIGH-DENSITY DATA TABLE */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start">{t.clientName}</th>
                  <th className="px-4 py-3 text-start">{t.phoneNumber}</th>
                  <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                  <th className="px-4 py-3 text-start">{t.unitType}</th>
                  <th className="px-4 py-3 text-start">{t.budget}</th>
                  <th className="px-4 py-3 text-start">{t.leadStatus}</th>
                  <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                  <th className="px-4 py-3 text-start">{t.leadSource}</th>
                  <th className="px-4 py-3 text-start">{t.nextFollowUpDate}</th>
                  <th className="px-4 py-3 text-end">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div
                        onClick={() => openLeadProfile(lead)}
                        className="hover:text-amber-700 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{lead.clientName}</span>
                        {lead.score && lead.score >= 90 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600" dir="ltr">
                      {lead.mobileNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {lead.interestedProject}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {lead.unitType}
                    </td>
                    <td className="px-4 py-3 font-black text-amber-900">
                      {lead.budget.toLocaleString()} {t.egpCurrency}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.leadStatus}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                      >
                        {pipelineStages.map((st) => (
                          <option key={st.id} value={st.id}>{st.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {lead.assignedSalesAgent}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium text-[11px]">
                      {lead.leadSource}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium text-[11px]">
                      {lead.nextFollowUpDate || '-'}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openCallModal(lead)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          title={t.quickCall}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openWhatsAppModal(lead)}
                          className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700"
                          title={t.quickWhatsApp}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openLeadProfile(lead)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-bold text-[10px] hover:bg-slate-800"
                        >
                          {t.viewProfile}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
