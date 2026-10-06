import React, { useState, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CallStatus } from '../../types/crm';
import { 
  Phone, PhoneOff, PhoneCall, Mic, MicOff, 
  Volume2, Clock, CheckCircle2, AlertCircle, X, Shield
} from 'lucide-react';

export const CallModal: React.FC = () => {
  const { callModalLead, closeCallModal, logCall, t, lang, currentUser } = useCrm();

  const [callState, setCallState] = useState<'ringing' | 'active' | 'ended'>('ringing');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('Answered');
  const [callNotes, setCallNotes] = useState('');
  const [nextAction, setNextAction] = useState('Schedule office meeting for floorplans review');

  useEffect(() => {
    let timer: any;
    if (callState === 'ringing') {
      const ringTimeout = setTimeout(() => {
        setCallState('active');
      }, 2500);
      return () => clearTimeout(ringTimeout);
    } else if (callState === 'active') {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!callModalLead) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    logCall({
      leadId: callModalLead.id,
      clientName: callModalLead.clientName,
      clientPhone: callModalLead.mobileNumber,
      salesAgent: currentUser.name,
      callDate: new Date().toISOString().split('T')[0],
      callTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: duration,
      callStatus,
      callNotes: callNotes || (lang === 'ar' ? 'تمت مناقشة المشروع ونظام الدفع.' : 'Discussed project terms and payment.'),
      nextAction: nextAction || (lang === 'ar' ? 'متابعة لاحقة' : 'Follow up')
    });
    closeCallModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-amber-400">
              {lang === 'ar' ? 'محاكي خط الاتصال المؤسسي (VoIP / Cellular)' : 'Corporate Telephony Integration (VoIP)'}
            </span>
          </div>
          <button onClick={closeCallModal} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Call In-Progress Area */}
        <div className="p-6 text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 text-2xl font-black mx-auto ring-4 ring-amber-400/20 shadow-xl">
              {callModalLead.clientName.charAt(0)}
            </div>
            {callState === 'active' && (
              <span className="absolute bottom-0 end-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            )}
          </div>

          <div>
            <h3 className="text-base font-black text-white">{callModalLead.clientName}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">{callModalLead.mobileNumber}</p>
            <p className="text-[11px] text-amber-400 font-medium mt-1">
              {callModalLead.interestedProject} • {callModalLead.unitType}
            </p>
          </div>

          {/* Status Indicator */}
          <div className="py-2">
            {callState === 'ringing' ? (
              <div className="text-amber-400 text-xs font-bold animate-pulse flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 animate-bounce" />
                <span>{lang === 'ar' ? 'جاري الاتصال والطلب...' : 'Ringing client phone...'}</span>
              </div>
            ) : callState === 'active' ? (
              <div className="space-y-2">
                <div className="text-emerald-400 text-sm font-black font-mono tracking-widest">
                  {formatSeconds(duration)}
                </div>
                {/* Audio Waveform simulation */}
                <div className="flex items-center justify-center gap-1 h-5">
                  {[40, 70, 30, 90, 60, 80, 50, 95, 45, 65, 35].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-amber-400 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs font-semibold">
                {lang === 'ar' ? 'انتهت المكالمة - يرجى تسجيل التقرير' : 'Call ended - enter call report below'}
              </div>
            )}
          </div>

          {/* Call Controls Buttons */}
          {callState !== 'ended' ? (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isMuted ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Mute"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Call Report Form (Shows after call or during active) */}
        <form onSubmit={handleSaveReport} className="bg-slate-950 p-4 border-t border-slate-800 space-y-3 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تقرير نتيجة المكالمة' : 'Call Outcome Report'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">{t.callStatus}</label>
              <select
                value={callStatus}
                onChange={(e) => setCallStatus(e.target.value as CallStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-semibold"
              >
                <option value="Answered">{t.callAnswered}</option>
                <option value="No Answer">{t.callNoAnswer}</option>
                <option value="Busy">{t.callBusy}</option>
                <option value="Call Back Later">{t.callCallBackLater}</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">{t.callDuration}</label>
              <input
                type="text"
                readOnly
                value={`${Math.round(duration)} ${lang === 'ar' ? 'ثانية' : 'sec'}`}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">{t.callNotes}</label>
            <textarea
              rows={2}
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب ملخص المكالمة ورد العميل واهتماماته...' : 'Summary of client conversation...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">{t.nextAction}</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder={lang === 'ar' ? 'الإجراء القادم (مثل: إرسال بروشور، اجتماع سموحة)...' : 'Scheduled next step...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeCallModal}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
            >
              {lang === 'ar' ? 'حفظ تقرير السيلز' : 'Save Call Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
