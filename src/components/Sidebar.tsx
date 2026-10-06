import React from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  LayoutDashboard, Users, PhoneCall, CalendarClock, 
  Building, Layers, BadgePercent, MapPin, 
  CheckSquare, MessageSquare, Trophy, LineChart, 
  UserX, PieChart, GitFork, Sparkles, Settings,
  ShieldAlert, ChevronRight, Sparkle
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  sparkle?: boolean;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, setActiveTab, t, leads, followUps, 
    reservations, currentUser, lang 
  } = useCrm();

  const overdueFollowUpsCount = followUps.filter(
    (f) => f.status === 'Pending' && (f.followUpDate < '2026-10-06' || f.priority === 'Urgent')
  ).length;

  const activeReservationsCount = reservations.filter(
    (r) => r.reservationStatus === 'Active'
  ).length;

  const navSections: NavSection[] = [
    {
      title: lang === 'ar' ? 'الرئيسية والعملاء' : 'Core & Pipeline',
      items: [
        { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
        { id: 'leads', label: t.navLeads, icon: Users, badge: leads.length },
        { id: 'calls', label: t.navCalls, icon: PhoneCall }, // تقارير السيلز
        { 
          id: 'followups', 
          label: t.navFollowUps, 
          icon: CalendarClock, 
          badge: overdueFollowUpsCount > 0 ? `${overdueFollowUpsCount}!` : undefined, 
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' 
        },
      ]
    },
    {
      title: lang === 'ar' ? 'المشاريع والعمليات' : 'Inventory & Deals',
      items: [
        { id: 'inventory', label: t.navInventory, icon: Building },
        { 
          id: 'reservations', 
          label: t.navReservations, 
          icon: BadgePercent, 
          badge: activeReservationsCount,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
        },
        { id: 'meetings', label: t.navMeetings, icon: MapPin },
        { id: 'tasks', label: t.navTasks, icon: CheckSquare },
      ]
    },
    {
      title: lang === 'ar' ? 'الإدارة والتحليلات' : 'Management & Reports',
      items: [
        { id: 'salesteam', label: t.navSalesTeam, icon: Trophy },
        { id: 'salesmanager', label: t.navSalesManager, icon: LineChart },
        { id: 'lostleads', label: t.navLostLeads, icon: UserX },
        { id: 'reports', label: t.navReports, icon: PieChart },
      ]
    },
    {
      title: lang === 'ar' ? 'الذكاء والأتمتة' : 'Automation & AI',
      items: [
        { 
          id: 'autodistribution', 
          label: t.navAutoDistribution, 
          icon: GitFork,
          sparkle: true
        },
        { 
          id: 'aiassistant', 
          label: t.navAiAssistant, 
          icon: Sparkles,
          highlight: true
        },
        { id: 'admin', label: t.navAdmin, icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-e border-slate-800/80 select-none shadow-xl">
      {/* Brand & Alexandria Tag */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            H
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wider">
              HEAVEN REAL ESTATE
            </h2>
            <p className="text-[10px] text-amber-400/90 font-medium">
              Alexandria & North Coast
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 font-semibold border border-amber-500/30 shadow-xs shadow-amber-500/5'
                        : item.highlight
                        ? 'text-amber-200/90 hover:bg-slate-900 hover:text-white border border-amber-400/20 bg-amber-400/5'
                        : 'text-slate-400 hover:bg-slate-900/90 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 transition-colors shrink-0 ${
                          isActive
                            ? 'text-amber-400'
                            : item.highlight
                            ? 'text-amber-400 animate-pulse'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Badges */}
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.sparkle && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer HQ location pill */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-slate-400">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px]">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{t.alexandriaHQ}</span>
        </div>
      </div>
    </aside>
  );
};
