import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Meeting, MeetingType } from '../types/crm';
import { MapPin, Calendar, Plus, Clock, User, CheckCircle2, Video, Building2 } from 'lucide-react';

export const MeetingsManager: React.FC = () => {
  const { meetings, addMeeting, updateMeetingStatus, t, lang, projects, salesAgents, leads } = useCrm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [meetingType, setMeetingType] = useState<MeetingType>('Office Meeting');
  const [project, setProject] = useState(projects[0]?.name || '');
  const [assignedAgent, setAssignedAgent] = useState(salesAgents[0]?.name || '');
  const [date, setDate] = useState('2026-10-08');
  const [time, setTime] = useState('02:00 PM');
  const [location, setLocation] = useState('Heaven Real Estate HQ - Kafr Abdo');
  const [notes, setNotes] = useState('');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];
    addMeeting({
      leadId: lead.id,
      clientName: lead.clientName,
      clientPhone: lead.mobileNumber,
      salesAgent: assignedAgent,
      project,
      meetingType,
      date,
      time,
      location,
      notes,
      status: 'Scheduled'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navMeetings}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'إدارة مقابلات الفروع، المعاينات الميدانية بمواقع المشروعات، والاجتماعات الافتراضية'
              : 'HQ appointments, on-site coastal inspections, and Zoom consultations'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'ar' ? 'حجز معاينة / اجتماع' : 'Book Site Visit / Meeting'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                    m.meetingType === 'Site Visit'
                      ? 'bg-purple-100 text-purple-800'
                      : m.meetingType === 'Online Meeting'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {m.meetingType === 'Site Visit' ? <MapPin className="w-3 h-3" /> :
                   m.meetingType === 'Online Meeting' ? <Video className="w-3 h-3" /> :
                   <Building2 className="w-3 h-3" />}
                  <span>{m.meetingType}</span>
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    m.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mb-0.5">{m.clientName}</h3>
              <p className="text-[11px] font-mono text-slate-500 mb-2" dir="ltr">{m.clientPhone}</p>

              <div className="space-y-1.5 py-2 border-y border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">{t.interestedProject}:</span>
                  <span className="font-bold text-slate-800">{m.project}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'الموعد:' : 'Schedule:'}</span>
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {m.date} • {m.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'المكان:' : 'Location:'}</span>
                  <span className="font-medium text-slate-700 truncate max-w-[170px]">{m.location}</span>
                </div>
              </div>

              {m.notes && (
                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl my-2">
                  {m.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                {m.salesAgent}
              </span>

              {m.status !== 'Completed' && (
                <button
                  onClick={() => updateMeetingStatus(m.id, 'Completed', 'Attended - High Interest')}
                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                >
                  {lang === 'ar' ? 'تمت بنجاح' : 'Mark Completed'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-sm font-black text-slate-900">
              {lang === 'ar' ? 'جدولة موعد معاينة أو اجتماع' : 'Book Site Visit / Meeting'}
            </h3>

            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.clientName}</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.clientName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{lang === 'ar' ? 'نوع المقابلة' : 'Type'}</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="Office Meeting">{lang === 'ar' ? 'اجتماع بالمكتب' : 'Office Meeting'}</option>
                    <option value="Site Visit">{lang === 'ar' ? 'معاينة بموقع المشروع' : 'Site Visit'}</option>
                    <option value="Online Meeting">{lang === 'ar' ? 'اجتماع أونلاين' : 'Online Meeting'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.interestedProject}</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.date}</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.time}</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{lang === 'ar' ? 'الموقع والعنوان' : 'Location'}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.notes}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 font-bold text-slate-950 rounded-xl hover:bg-amber-600"
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
