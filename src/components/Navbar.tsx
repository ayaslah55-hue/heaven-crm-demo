import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { UserRole } from '../types/crm';
import { 
  Building2, Bell, Search, Plus, Globe, 
  ChevronDown, CheckCircle, Clock, AlertTriangle, 
  LogOut, Shield, User, PhoneCall, CheckCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    lang, toggleLanguage, t, currentUser, switchRole, 
    logout, notifications, markNotificationRead, markAllNotificationsRead,
    unreadNotificationsCount, setIsNewLeadModalOpen, setActiveTab, setSelectedLead,
    setIsLeadProfileOpen, leads
  } = useCrm();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof leads>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const roles: { id: UserRole; label: string }[] = [
    { id: 'Admin', label: t.adminRole },
    { id: 'Sales Manager', label: t.salesManagerRole },
    { id: 'Team Leader', label: t.teamLeaderRole },
    { id: 'Sales Agent', label: t.salesAgentRole },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const filtered = leads.filter(
      (l) =>
        l.clientName.toLowerCase().includes(q.toLowerCase()) ||
        l.mobileNumber.includes(q) ||
        l.interestedProject.toLowerCase().includes(q.toLowerCase())
    );
    setSearchResults(filtered);
    setIsSearchOpen(true);
  };

  const handleSelectLeadFromSearch = (lead: (typeof leads)[0]) => {
    setSelectedLead(lead);
    setIsLeadProfileOpen(true);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Tagline (Mobile & Desktop) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-amber-900 flex items-center justify-center text-amber-400 shadow-md shadow-amber-950/20 ring-1 ring-amber-400/30">
            <Building2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                HEAVEN
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-700 border border-amber-500/20">
                CRM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t.companySubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            className="w-full ps-10 pe-4 py-2 text-xs md:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all outline-hidden"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'العملاء المطابقون للبحث' : 'Matching Leads'}
            </div>
            {searchResults.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleSelectLeadFromSearch(lead)}
                className="px-3 py-2.5 hover:bg-amber-50/50 cursor-pointer flex items-center justify-between border-b border-slate-100 last:border-0 transition-colors"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900">{lead.clientName}</div>
                  <div className="text-[11px] text-slate-500">{lead.mobileNumber} • {lead.interestedProject}</div>
                </div>
                <div className="text-end">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {lead.leadStatus}
                  </span>
                  <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                    {lead.budget.toLocaleString()} {t.egpCurrency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Pill (Crucial for Demo Testing) */}
        <div className="hidden lg:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xl:inline">{lang === 'ar' ? 'الدور:' : 'Role:'}</span>
          </span>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentUser.role === r.id
                  ? 'bg-slate-900 text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {r.id === 'Sales Manager' ? (lang === 'ar' ? 'مدير المبيعات' : 'Manager') :
               r.id === 'Admin' ? (lang === 'ar' ? 'أدمن' : 'Admin') :
               r.id === 'Team Leader' ? (lang === 'ar' ? 'قائد فريق' : 'Team Lead') :
               (lang === 'ar' ? 'سيلز' : 'Agent')}
            </button>
          ))}
        </div>

        {/* Add Lead Quick Button */}
        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-xs shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">{t.addNewLead}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60 cursor-pointer"
          title="Switch Language / تغيير اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute end-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{t.notifications}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                      {unreadNotificationsCount} {lang === 'ar' ? 'جديد' : 'new'}
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {lang === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.leadId) {
                          const target = leads.find((l) => l.id === notif.leadId);
                          if (target) {
                            setSelectedLead(target);
                            setIsLeadProfileOpen(true);
                            setIsNotifOpen(false);
                          }
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                        !notif.read ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'overdue' ? (
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : notif.type === 'reservation' || notif.type === 'deal' ? (
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/50"
            />
            <div className="text-start hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold leading-tight">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute end-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-[10px] font-semibold text-slate-600 mt-1">
                  {currentUser.team}
                </div>
              </div>

              {/* Mobile Role Switcher inside menu */}
              <div className="px-3 py-2 border-b border-slate-100 lg:hidden">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {lang === 'ar' ? 'تبديل الدور للتجربة' : 'Switch Role'}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`text-[11px] p-1.5 rounded-lg text-start ${
                        currentUser.role === r.id
                          ? 'bg-slate-900 text-amber-300 font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-start text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  {t.navAdmin}
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-start text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
