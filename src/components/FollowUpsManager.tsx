import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { FollowUp, FollowUpType, Priority } from '../types/crm';
import { 
  CalendarClock, AlertTriangle, CheckCircle, Clock, 
  PhoneCall, MessageSquare, Plus, Filter, Calendar, 
  User, CheckCheck, RefreshCw, ChevronRight, X
} from 'lucide-react';

export const FollowUpsManager: React.FC = () => {
  const { 
    followUps, completeFollowUp, rescheduleFollowUp, addFollowUp,
    t, lang, leads, openCallModal, openWhatsAppModal, openLeadProfile 
  } = useCrm();

  const [filterTab, setFilterTab] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-10-07');
  const [newTime, setNewTime] = useState('02:00 PM');

  // Form for new follow-up
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [fuType, setFuType] = useState<FollowUpType>('Phone Call');
  const [fuPriority, setFuPriority] = useState<Priority>('High');
  const [fuDate, setFuDate] = useState('2026-10-06');
  const [fuTime, setFuTime] = useState('01:00 PM');
  const [fuNotes, setFuNotes] = useState('');

  const todayStr = '2026-10-06';

  const isOverdue = (fu: FollowUp) => {
    return fu.status === 'Pending' && fu.followUpDate < todayStr;
  };

  const isToday = (fu: FollowUp) => {
    return fu.status === 'Pending' && fu.followUpDate === todayStr;
  };

  const isUpcoming = (fu: FollowUp) => {
    return fu.status === 'Pending' && fu.followUpDate > todayStr;
  };

  const filteredFollowUps = followUps.filter((fu) => {
    if (filterTab === 'overdue') return isOverdue(fu);
    if (filterTab === 'today') return isToday(fu);
    if (filterTab === 'upcoming') return isUpcoming(fu);
    return true;
  });

  const overdueCount = followUps.filter(isOverdue).length;
  const todayCount = followUps.filter(isToday).length;

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];
    addFollowUp({
      leadId: lead.id,
      clientName: lead.clientName,
      clientPhone: lead.mobileNumber,
      interestedProject: lead.interestedProject,
      assignedAgent: lead.assignedSalesAgent,
      followUpDate: fuDate,
      followUpTime: fuTime,
      followUpType: fuType,
      priority: fuPriority,
      notes: fuNotes || 'Scheduled client outreach',
      status: 'Pending'
    });
    setIsAddModalOpen(false);
    setFuNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navFollowUps}</h1>
            {overdueCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{overdueCount} {t.overdueAlert}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'متابعة الاتصالات والرسائل الدورية وتنبيهات المواعيد وتلوين المتأخرات بالأحمر'
              : 'Daily sales outreach pipeline, SLA alerts, overdue red flags, and rescheduling'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'ar' ? 'جدولة متابعة جديدة' : 'Schedule Follow-up'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'ar' ? 'جميع المتابعات' : 'All Follow-ups'} ({followUps.length})
        </button>

        <button
          onClick={() => setFilterTab('overdue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === 'overdue'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'المتأخرات' : 'Overdue'} ({overdueCount})</span>
        </button>

        <button
          onClick={() => setFilterTab('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'today'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {lang === 'ar' ? 'متابعات اليوم' : "Today's Queue"} ({todayCount})
        </button>

        <button
          onClick={() => setFilterTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'upcoming'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'ar' ? 'القادمة لاحقاً' : 'Upcoming'}
        </button>
      </div>

      {/* Follow-ups List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFollowUps.map((fu) => {
          const overdue = isOverdue(fu);
          const targetLead = leads.find((l) => l.id === fu.leadId) || leads[0];
          return (
            <div
              key={fu.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between shadow-xs ${
                overdue
                  ? 'bg-red-50/40 border-red-300 ring-1 ring-red-300/50 hover:border-red-400'
                  : fu.status === 'Completed'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-amber-400'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div
                      onClick={() => openLeadProfile(targetLead)}
                      className="font-bold text-sm text-slate-900 hover:text-amber-700 cursor-pointer"
                    >
                      {fu.clientName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                      {fu.clientPhone}
                    </div>
                  </div>

                  {overdue ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      {t.overdueAlert}
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        fu.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fu.status}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 py-2 my-1 border-y border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">{t.interestedProject}:</span>
                    <span className="font-semibold text-slate-800">{fu.interestedProject}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">{t.salesAgent}:</span>
                    <span className="font-semibold text-slate-800">{fu.assignedAgent}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'الموعد المحدد' : 'Scheduled'}:</span>
                    <span className={`font-bold flex items-center gap-1 ${overdue ? 'text-red-700' : 'text-slate-800'}`}>
                      <Clock className="w-3 h-3" />
                      {fu.followUpDate} • {fu.followUpTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">{t.followUpType}:</span>
                    <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                      {fu.followUpType}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2 my-2">
                  {fu.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openCallModal(targetLead)}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title={t.quickCall}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openWhatsAppModal(targetLead)}
                    className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                    title={t.quickWhatsApp}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setRescheduleId(fu.id);
                    }}
                    className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.reschedule}</span>
                  </button>
                  {fu.status !== 'Completed' && (
                    <button
                      onClick={() => completeFollowUp(fu.id)}
                      className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>{t.markCompleted}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {rescheduleId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">{t.reschedule}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">{t.date}</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">{t.time}</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleId(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  rescheduleFollowUp(rescheduleId, newDate, newTime);
                  setRescheduleId(null);
                }}
                className="px-4 py-1.5 rounded-xl text-xs bg-amber-500 text-slate-950 font-bold hover:bg-amber-600"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New FollowUp Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                {lang === 'ar' ? 'جدولة متابعة جديدة' : 'Schedule New Follow-up'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.clientName}</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.clientName} ({l.interestedProject})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.followUpType}</label>
                  <select
                    value={fuType}
                    onChange={(e) => setFuType(e.target.value as FollowUpType)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {['Phone Call', 'WhatsApp', 'Meeting', 'Site Visit', 'Send Offer', 'Contract Follow-up'].map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.priority}</label>
                  <select
                    value={fuPriority}
                    onChange={(e) => setFuPriority(e.target.value as Priority)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.date}</label>
                  <input
                    type="date"
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.time}</label>
                  <input
                    type="text"
                    value={fuTime}
                    onChange={(e) => setFuTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.notes}</label>
                <textarea
                  rows={2}
                  value={fuNotes}
                  onChange={(e) => setFuNotes(e.target.value)}
                  placeholder={lang === 'ar' ? 'أهداف المتابعة وتفاصيل العرض...' : 'Outreach objective and notes...'}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 shadow-xs"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
