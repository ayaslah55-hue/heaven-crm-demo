import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Lead, Unit, LeadStatus } from '../types/crm';
import { 
  X, PhoneCall, MessageSquare, Calendar, Plus, 
  CheckCircle2, Clock, MapPin, DollarSign, Building, 
  Sparkles, Share2, Tag, Shield, History, Send, Layers,
  ChevronRight, BadgePercent, ArrowUpRight
} from 'lucide-react';

export const LeadProfileModal: React.FC = () => {
  const { 
    selectedLead, isLeadProfileOpen, setIsLeadProfileOpen, 
    t, lang, units, openCallModal, openWhatsAppModal, 
    updateLeadStatus, addTimelineItem, addReservation,
    salesAgents 
  } = useCrm();

  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'details'>('timeline');

  if (!isLeadProfileOpen || !selectedLead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addTimelineItem(selectedLead.id, {
      type: 'note',
      title: lang === 'ar' ? 'ملاحظة مسجلة' : 'Internal Sales Note',
      description: newNote.trim(),
      agentName: selectedLead.assignedSalesAgent
    });
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
              {selectedLead.clientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {selectedLead.clientName}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedLead.leadStatus}
                </span>
                {selectedLead.score && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {selectedLead.score}% {lang === 'ar' ? 'احتمالية الشراء' : 'Match'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono" dir="ltr">
                {selectedLead.mobileNumber} • {selectedLead.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCallModal(selectedLead)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
              title={t.quickCall}
            >
              <PhoneCall className="w-4 h-4" />
              <span className="hidden sm:inline">{t.quickCall}</span>
            </button>
            <button
              onClick={() => openWhatsAppModal(selectedLead)}
              className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-slate-950 font-bold transition-all flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
              title={t.quickWhatsApp}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{t.quickWhatsApp}</span>
            </button>
            <button
              onClick={() => setIsLeadProfileOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'سجل الأنشطة والتايم لاين' : 'Activity Timeline'}</span>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4 text-slate-500" />
            <span>{lang === 'ar' ? 'بيانات واحتياجات العميل' : 'Client Profile Data'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: ACTIVITY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Quick Note Box */}
              <form onSubmit={handleAddNote} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={lang === 'ar' ? 'أضف ملاحظة أو نتيجة اتصال مع العميل...' : 'Add a quick note or phone call result...'}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تدوين' : 'Post'}</span>
                  </button>
                </div>
              </form>

              {/* Chronological Timeline items */}
              <div className="relative border-s-2 border-slate-200 ms-4 space-y-6 pt-2">
                {selectedLead.timeline && selectedLead.timeline.length > 0 ? (
                  selectedLead.timeline.map((item) => (
                    <div key={item.id} className="relative ps-6 group">
                      {/* Timeline dot */}
                      <div className="absolute -start-[17px] top-1 w-8 h-8 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center text-slate-800 shadow-xs">
                        {item.type === 'call' ? (
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        ) : item.type === 'whatsapp' ? (
                          <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                        ) : item.type === 'meeting' ? (
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        ) : item.type === 'reservation' ? (
                          <BadgePercent className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs group-hover:border-amber-400/50 transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span>{lang === 'ar' ? 'المسؤول:' : 'Agent:'}</span>
                          <span className="font-bold text-slate-700">{item.agentName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="ps-6 text-xs text-slate-400 py-6">
                    {lang === 'ar' ? 'لا توجد أنشطة سابقة مسجلة لهذا العميل' : 'No prior activities logged'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETE PROFILE DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-black text-slate-900 pb-2 border-b border-slate-200">
                  {lang === 'ar' ? 'التفاصيل المالية والتفضيلات' : 'Financials & Preferences'}
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.budget}</span>
                  <span className="font-bold text-amber-900">{selectedLead.budget.toLocaleString()} {t.egpCurrency}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.paymentPreference}</span>
                  <span className="font-bold text-slate-800">{selectedLead.paymentPreference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.interestedProject}</span>
                  <span className="font-bold text-slate-800">{selectedLead.interestedProject}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.unitType}</span>
                  <span className="font-bold text-slate-800">{selectedLead.unitType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t.preferredLocation}</span>
                  <span className="font-bold text-slate-800">{selectedLead.preferredLocation}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-black text-slate-900 pb-2 border-b border-slate-200">
                  {lang === 'ar' ? 'معلومات المصدر والتسويق' : 'Source & Assignment'}
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.leadSource}</span>
                  <span className="font-bold text-slate-800">{selectedLead.leadSource}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.campaign}</span>
                  <span className="font-bold text-slate-800">{selectedLead.campaign || '-'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.salesAgent}</span>
                  <span className="font-bold text-amber-800">{selectedLead.assignedSalesAgent}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.nextFollowUpDate}</span>
                  <span className="font-bold text-slate-800">{selectedLead.nextFollowUpDate} ({selectedLead.nextFollowUpTime || '11:00 AM'})</span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">{t.notes}</span>
                  <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {selectedLead.notes || (lang === 'ar' ? 'لا توجد ملاحظات مسجلة' : 'No notes')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{lang === 'ar' ? 'تحديث مرحلة العميل:' : 'Update Stage:'}</span>
            <select
              value={selectedLead.leadStatus}
              onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 cursor-pointer"
            >
              {[
                'New Lead', 'Contacted', 'Interested', 'Qualified', 
                'Meeting Scheduled', 'Site Visit', 'Negotiation', 
                'Reservation', 'Closed Deal', 'Follow-up Later', 'Lost Lead'
              ].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsLeadProfileOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
