import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { UserRole } from '../types/crm';
import { Building2, Shield, Lock, Mail, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, lang, toggleLanguage, t } = useCrm();
  const [email, setEmail] = useState('tarek.manager@heaven-re.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Sales Manager');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  const rolesConfig: { role: UserRole; title: string; descAr: string; descEn: string }[] = [
    {
      role: 'Admin',
      title: t.adminRole,
      descAr: 'صلاحيات كاملة للمنظومة، إدارة الموظفين، إعدادات الحسابات والعمولات',
      descEn: 'Full system control, personnel management, permissions and commissions',
    },
    {
      role: 'Sales Manager',
      title: t.salesManagerRole,
      descAr: 'مراقبة خط أنابيب المبيعات، مؤشرات الأداء، تفريغ الإحصائيات وسير الصفقات',
      descEn: 'Pipeline oversight, agent SLAs, revenue forecast, deal validations',
    },
    {
      role: 'Team Leader',
      title: t.teamLeaderRole,
      descAr: 'متابعة فريق السيلز المباشر، توزيع الفرص البيعية، واعتماد العروض',
      descEn: 'Supervise direct squad, reallocate leads, approve custom terms',
    },
    {
      role: 'Sales Agent',
      title: t.salesAgentRole,
      descAr: 'التواصل مع العملاء، تسجيل المكالمات والواتساب، إتمام المعاينات والحجوزات',
      descEn: 'Lead outreach, call logging, WhatsApp follow-ups, and bookings',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 md:p-8 text-slate-100 relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language Toggle */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-extrabold text-base md:text-lg tracking-wider text-white">
              HEAVEN REAL ESTATE
            </h1>
            <p className="text-[11px] text-amber-300 font-medium">Alexandria • North Coast • New Cairo</p>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      {/* Central Login Box & Role Switcher */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left/Main Form Box */}
          <div className="md:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                {t.companyTagline}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-3">{t.loginTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.loginSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t.email}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full ps-10 pe-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert(lang === 'ar' ? 'يمكنك تسجيل الدخول بالدور الذي تختاره تجريبياً فوراً.' : 'You can log in directly with any role selected for demo.')}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{t.loginButton}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>

          {/* Right Role Picker for Demo Testing */}
          <div className="md:col-span-5 space-y-3">
            <div className="mb-2">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{t.quickRoleTest}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'اختر الدور لاختبار صلاحيات الدخول المخصصة فوراً:'
                  : 'Select an authorized profile to experience customized views:'}
              </p>
            </div>

            <div className="space-y-2.5">
              {rolesConfig.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => {
                      setSelectedRole(r.role);
                      const emailMap: Record<UserRole, string> = {
                        Admin: 'karim.admin@heaven-re.com',
                        'Sales Manager': 'tarek.manager@heaven-re.com',
                        'Team Leader': 'sara.mohamed@heaven-re.com',
                        'Sales Agent': 'ahmed.salah@heaven-re.com',
                      };
                      setEmail(emailMap[r.role]);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-amber-400/80 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                        {r.title}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {lang === 'ar' ? r.descAr : r.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 relative z-10 py-2">
        Heaven Real Estate CRM • Alexandria HQ (Smouha & Kafr Abdo) • Powered by Enterprise Suite
      </div>
    </div>
  );
};
