import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { LeadSource, UnitType, LeadStatus } from '../../types/crm';
import { X, UserPlus, Building, DollarSign, Phone, Mail, Calendar } from 'lucide-react';

export const NewLeadModal: React.FC = () => {
  const { 
    isNewLeadModalOpen, setIsNewLeadModalOpen, addLead, 
    projects, salesAgents, t, lang 
  } = useCrm();

  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [leadSource, setLeadSource] = useState<LeadSource>('Facebook');
  const [campaign, setCampaign] = useState('Alexandria Luxury Q4');
  const [interestedProject, setInterestedProject] = useState(projects[0]?.name || 'Sawari New Alexandria');
  const [unitType, setUnitType] = useState<UnitType>('Apartment');
  const [preferredLocation, setPreferredLocation] = useState('New Alexandria');
  const [budget, setBudget] = useState<number>(6000000);
  const [paymentPreference, setPaymentPreference] = useState<'Cash' | 'Installments (3-5 yrs)' | 'Installments (6-8 yrs)' | 'Long-term (9+ yrs)'>('Installments (6-8 yrs)');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New Lead');
  const [assignedSalesAgent, setAssignedSalesAgent] = useState(salesAgents[0]?.name || 'Ahmed Salah');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('2026-10-06');
  const [nextFollowUpTime, setNextFollowUpTime] = useState('12:00 PM');
  const [notes, setNotes] = useState('');

  if (!isNewLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !mobileNumber.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    addLead({
      clientName: clientName.trim(),
      mobileNumber: mobileNumber.trim(),
      whatsappNumber: (whatsappNumber || mobileNumber).trim(),
      email: email.trim() || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      leadSource,
      campaign,
      interestedProject,
      unitType,
      preferredLocation,
      budget: Number(budget) || 5000000,
      paymentPreference,
      leadStatus,
      assignedSalesAgent,
      lastContactDate: todayStr,
      nextFollowUpDate: nextFollowUpDate || todayStr,
      nextFollowUpTime,
      notes: notes.trim()
    });

    setIsNewLeadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">{t.addNewLead}</h2>
              <p className="text-[11px] text-amber-300">Heaven Real Estate Alexandria CRM</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewLeadModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          {/* Section 1: Contact Details */}
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-2">
              1. {lang === 'ar' ? 'بيانات التواصل الأساسية' : 'Primary Contact Details'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.clientName} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Tarek El-Shennawy"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.phoneNumber} *</label>
                <input
                  type="text"
                  required
                  placeholder="+20 100 123 4567"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (!whatsappNumber) setWhatsappNumber(e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.whatsappNumber}</label>
                <input
                  type="text"
                  placeholder="+20 100 123 4567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.email}</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Property Preferences & Budget */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-2">
              2. {lang === 'ar' ? 'احتياجات العقار والميزانية' : 'Property Interest & Budget'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.interestedProject} *</label>
                <select
                  value={interestedProject}
                  onChange={(e) => setInterestedProject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.unitType}</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as UnitType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  {['Apartment', 'Duplex', 'Chalet', 'Penthouse', 'Standalone Villa', 'Townhouse', 'Commercial'].map((ut) => (
                    <option key={ut} value={ut}>{ut}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.budget} ({t.egpCurrency})
                </label>
                <input
                  type="number"
                  step={500000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-black"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.paymentPreference}</label>
                <select
                  value={paymentPreference}
                  onChange={(e) => setPaymentPreference(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Installments (6-8 yrs)">Installments (6-8 yrs)</option>
                  <option value="Installments (3-5 yrs)">Installments (3-5 yrs)</option>
                  <option value="Long-term (9+ yrs)">Long-term (9+ yrs)</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Assignment & Source */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-2">
              3. {lang === 'ar' ? 'المصدر والتكليف البيعي' : 'Source & Sales Consultant'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.leadSource}</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as LeadSource)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                >
                  {['Facebook', 'Instagram', 'Website', 'WhatsApp', 'Phone Call', 'Referral', 'Property Portal', 'Walk-in'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.salesAgent}</label>
                <select
                  value={assignedSalesAgent}
                  onChange={(e) => setAssignedSalesAgent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {salesAgents.map((ag) => (
                    <option key={ag.id} value={ag.name}>{ag.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.leadStatus}</label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {['New Lead', 'Contacted', 'Interested', 'Qualified', 'Meeting Scheduled'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="font-bold text-slate-700 block mb-1">{t.notes}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={lang === 'ar' ? 'تفاصيل اهتمام العميل، طلبات خاصة، أو مواعيد الاتصال المفضلة...' : 'Specific client requests, floor preferences, best call times...'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewLeadModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {t.addNewLead}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
