import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Trophy, Medal, Award, PhoneCall, Calendar, TrendingUp, DollarSign, UserCheck, CheckCircle2 } from 'lucide-react';

export const SalesTeamManager: React.FC = () => {
  const { salesAgents, t, lang } = useCrm();

  // Sort by sales value for leaderboard
  const leaderboard = [...salesAgents].sort((a, b) => b.salesValue - a.salesValue);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.salesTeamTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.salesTeamSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-4 h-4" />
            <span>Q4 Leaderboard 2026</span>
          </span>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {leaderboard.slice(0, 3).map((agent, index) => {
          const isGold = index === 0;
          const isSilver = index === 1;
          const isBronze = index === 2;

          return (
            <div
              key={agent.id}
              className={`rounded-3xl p-5 border relative overflow-hidden transition-all shadow-xs ${
                isGold
                  ? 'bg-gradient-to-b from-amber-500/10 via-white to-amber-50/30 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Badge Rank */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
                  />
                  <div className={`absolute -bottom-2 -end-2 w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 shadow-md ${
                    isGold ? 'bg-amber-400' : isSilver ? 'bg-slate-300' : 'bg-amber-700 text-white'
                  }`}>
                    #{index + 1}
                  </div>
                </div>

                <div className="text-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isGold ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {agent.team}
                  </span>
                  <div className="text-sm font-black text-slate-900 mt-1">{agent.name}</div>
                  <div className="text-[10px] text-slate-400">{agent.role}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{t.totalSalesValue}:</span>
                  <span className="font-black text-amber-900">
                    {(agent.salesValue / 1000000).toFixed(1)}M {t.egpCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{t.closedDealsCount}:</span>
                  <span className="font-bold text-emerald-700">{agent.closedDeals} deals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{t.conversionRate}:</span>
                  <span className="font-bold text-slate-800">{agent.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'الاتصالات المنفذة' : 'Calls Made'}:</span>
                  <span className="font-bold text-slate-800">{agent.callsMade}</span>
                </div>
              </div>

              {/* Progress towards target */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-semibold mb-1">
                  <span className="text-slate-500">{lang === 'ar' ? 'تحقيق التارجت' : 'Target %'}</span>
                  <span className="text-amber-800 font-bold">
                    {Math.round((agent.salesValue / agent.targetValue) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                    style={{ width: `${Math.min(Math.round((agent.salesValue / agent.targetValue) * 100), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Agents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-black text-xs text-slate-900">{t.agentLeaderboard}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'الفريق' : 'Squad'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'العملاء المسندون' : 'Assigned Leads'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'المكالمات' : 'Calls'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'المتابعات' : 'Follow-ups'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'المعاينات' : 'Site Visits'}</th>
                <th className="px-4 py-3 text-start">{t.reservationsCount}</th>
                <th className="px-4 py-3 text-start">{t.closedDealsCount}</th>
                <th className="px-4 py-3 text-start">{t.totalSalesValue}</th>
                <th className="px-4 py-3 text-end">{t.conversionRate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((ag) => (
                <tr key={ag.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                    <img src={ag.avatar} alt={ag.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-400" />
                    <div>
                      <div>{ag.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ag.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
                    {ag.team}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    {ag.assignedLeads}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {ag.callsMade}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {ag.followUpsCompleted}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {ag.siteVisits}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-amber-800">
                    {ag.reservations}
                  </td>
                  <td className="px-4 py-3.5 font-black text-emerald-700">
                    {ag.closedDeals}
                  </td>
                  <td className="px-4 py-3.5 font-black text-slate-900">
                    {(ag.salesValue / 1000000).toFixed(1)}M {t.egpCurrency}
                  </td>
                  <td className="px-4 py-3.5 text-end font-bold text-emerald-700">
                    {ag.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
