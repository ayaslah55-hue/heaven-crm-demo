import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  X, Send, Share2, MapPin, FileText, 
  CreditCard, ExternalLink, CheckCheck, MessageSquare
} from 'lucide-react';

export const WhatsAppModal: React.FC = () => {
  const { whatsappModalLead, closeWhatsAppModal, logWhatsAppMessage, t, lang, currentUser } = useCrm();

  const [templateType, setTemplateType] = useState<'brochure' | 'payment_plan' | 'location' | 'followup' | 'custom'>('brochure');
  const [customText, setCustomText] = useState('');

  if (!whatsappModalLead) return null;

  const templates: Record<string, string> = {
    brochure: lang === 'ar'
      ? `أهلاً بحضرتك أستاذ ${whatsappModalLead.clientName}، مع حضرتك ${currentUser.name} من شركة Heaven Real Estate (الإسكندرية).\nيسعدني مشاركة البروشور الرسمي لمشروع ${whatsappModalLead.interestedProject} ومخططات الوحدات (${whatsappModalLead.unitType}).\nنحن بخدمتكم لأي استفسار.`
      : `Dear Mr/Ms ${whatsappModalLead.clientName}, This is ${currentUser.name} from Heaven Real Estate Alexandria.\nPlease find attached the masterplan and catalog for ${whatsappModalLead.interestedProject}.\nLooking forward to assisting you.`,

    payment_plan: lang === 'ar'
      ? `تحياتنا لحضرتك أستاذ ${whatsappModalLead.clientName}.\nبناءً على طلبكم لمشروع ${whatsappModalLead.interestedProject}، يسعدنا إرسال جدول الأقساط الميسر بمقدم يبدأ من 10% وتقسيط حتى 7 و 8 سنوات متساوية بدون فوائد.\nهل يناسب حضرتك تحديد موعد لمراجعة العقود؟`
      : `Hello ${whatsappModalLead.clientName},\nHere is the official installment breakdown for ${whatsappModalLead.interestedProject} with up to 8 years equal payment plans.\nLet us know when you'd like to review unit reservations.`,

    location: lang === 'ar'
      ? `أهلاً بحضرتك أستاذ ${whatsappModalLead.clientName}.\nمرفق موقع المعاينة المباشر لمشروع ${whatsappModalLead.interestedProject}:\n📍 الموقع: الإسكندرية / الساحل الشمالي - مركز مبيعات Heaven Real Estate.\nفي انتظار تشريفكم يوم المعاينة.`
      : `Hello ${whatsappModalLead.clientName},\nHere is the GPS location for your site visit to ${whatsappModalLead.interestedProject}:\n📍 Heaven Real Estate Site Sales Center.\nWe look forward to welcoming you!`,

    followup: lang === 'ar'
      ? `مساء الخير أستاذ ${whatsappModalLead.clientName}، أتمنى لحضرتك يوماً سعيداً.\nكنت أود الاطمئنان على رأي حضرتك في العرض المالي الأخير لمشروع ${whatsappModalLead.interestedProject}، وهل هناك أي تفاصيل إضافية تحب أن نوضحها؟`
      : `Good afternoon ${whatsappModalLead.clientName},\nFollowing up on our recent discussion regarding ${whatsappModalLead.interestedProject}.\nDo you have any questions regarding the proposed offer?`,

    custom: customText
  };

  const currentMessage = templateType === 'custom' ? customText : templates[templateType];

  const handleSend = (openExternal: boolean) => {
    logWhatsAppMessage({
      leadId: whatsappModalLead.id,
      clientName: whatsappModalLead.clientName,
      clientPhone: whatsappModalLead.mobileNumber,
      salesAgent: currentUser.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      templateType,
      messageText: currentMessage,
      status: 'Sent'
    });

    if (openExternal) {
      // Clean phone number for wa.me
      const cleanPhone = whatsappModalLead.mobileNumber.replace(/[^0-9]/g, '');
      const encodedText = encodeURIComponent(currentMessage);
      window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
    }

    closeWhatsAppModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xs">
                {lang === 'ar' ? 'إرسال رسالة واتساب للعميل' : 'Send WhatsApp Message'}
              </h3>
              <p className="text-[10px] text-emerald-100">
                {whatsappModalLead.clientName} ({whatsappModalLead.mobileNumber})
              </p>
            </div>
          </div>
          <button onClick={closeWhatsAppModal} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selectors */}
        <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 block">
            {lang === 'ar' ? 'اختر قالب الرسالة الجاهز:' : 'Select Message Template:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => setTemplateType('brochure')}
              className={`p-2 rounded-xl border text-center font-bold transition-all ${
                templateType === 'brochure'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>{lang === 'ar' ? 'بروشور' : 'Brochure'}</span>
            </button>

            <button
              onClick={() => setTemplateType('payment_plan')}
              className={`p-2 rounded-xl border text-center font-bold transition-all ${
                templateType === 'payment_plan'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>{lang === 'ar' ? 'خطة سداد' : 'Payment'}</span>
            </button>

            <button
              onClick={() => setTemplateType('location')}
              className={`p-2 rounded-xl border text-center font-bold transition-all ${
                templateType === 'location'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>{lang === 'ar' ? 'لوكيشن' : 'Location'}</span>
            </button>

            <button
              onClick={() => setTemplateType('followup')}
              className={`p-2 rounded-xl border text-center font-bold transition-all ${
                templateType === 'followup'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>{lang === 'ar' ? 'متابعة' : 'Followup'}</span>
            </button>
          </div>
        </div>

        {/* Message Editor */}
        <div className="p-4 space-y-3">
          <label className="text-[11px] font-bold text-slate-500 block">
            {lang === 'ar' ? 'نص الرسالة المرسلة:' : 'Message Content:'}
          </label>
          <textarea
            rows={5}
            value={currentMessage}
            onChange={(e) => {
              setTemplateType('custom');
              setCustomText(e.target.value);
            }}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-hidden focus:border-emerald-500 leading-relaxed font-sans"
          />
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={() => handleSend(false)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'تسجيل في التايم لاين فقط' : 'Log to Timeline Only'}
          </button>

          <button
            onClick={() => handleSend(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>{t.openInWhatsAppWeb}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
