import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { BadgePercent, CheckCircle2, ArrowRight, DollarSign, Calendar, User, FileText, Download } from 'lucide-react';

export const ReservationsAndDeals: React.FC = () => {
  const { reservations, deals, convertToDeal, t, lang } = useCrm();

  const [activeSubTab, setActiveSubTab] = useState<'reservations' | 'deals'>('reservations');

  const totalClosedValue = deals.reduce((acc, d) => acc + d.dealValue, 0);
  const totalCommission = deals.reduce((acc, d) => acc + d.commission, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.reservationsTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'تتبع مبالغ جدية الحجز المودعة، والتحويل إلى عقود بيع نهائية وحساب العمولات'
              : 'Tracking token deposit reservations, converting to signed deals, and commissions'}
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('reservations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'reservations'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'الحجوزات النشطة' : 'Active Reservations'} ({reservations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('deals')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'deals'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'العقود المغلقة' : 'Closed Deals'} ({deals.length})
          </button>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {lang === 'ar' ? 'إجمالي الحجوزات المفتوحة' : 'Open Reservations'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {reservations.filter((r) => r.reservationStatus === 'Active').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {t.totalSalesValue}
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-900">
            {(totalClosedValue / 1000000).toFixed(1)} <span className="text-xs">{lang === 'ar' ? 'مليون ج.م' : 'M EGP'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">
            {lang === 'ar' ? 'إجمالي عمولات الفريق المحققة' : 'Team Commission Earned'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {totalCommission.toLocaleString()} <span className="text-xs">{t.egpCurrency}</span>
          </div>
        </div>
      </div>

      {/* VIEW: RESERVATIONS */}
      {activeSubTab === 'reservations' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start">{t.clientName}</th>
                  <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                  <th className="px-4 py-3 text-start">{lang === 'ar' ? 'كود الوحدة' : 'Unit Code'}</th>
                  <th className="px-4 py-3 text-start">{t.unitPrice}</th>
                  <th className="px-4 py-3 text-start">{t.reservationAmount}</th>
                  <th className="px-4 py-3 text-start">{t.paymentStatus}</th>
                  <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                  <th className="px-4 py-3 text-start">{t.status}</th>
                  <th className="px-4 py-3 text-end">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{res.clientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{res.clientPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {res.project}
                    </td>
                    <td className="px-4 py-3.5 font-bold font-mono text-amber-900">
                      {res.unitCode}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {res.unitPrice.toLocaleString()} {t.egpCurrency}
                    </td>
                    <td className="px-4 py-3.5 font-black text-emerald-700">
                      {res.reservationAmount.toLocaleString()} {t.egpCurrency}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {res.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {res.salesAgent}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                        {res.reservationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      {res.reservationStatus === 'Active' ? (
                        <button
                          onClick={() => {
                            if (confirm(lang === 'ar' ? `هل تؤكد تحويل حجز ${res.clientName} إلى عقد بيع رسمي نهائي؟` : `Convert reservation to finalized deal?`)) {
                              convertToDeal(res.id, res.unitPrice, 2);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center gap-1 ms-auto transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.convertToDeal}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ {lang === 'ar' ? 'عقد مبرم' : 'Contracted'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW: CLOSED DEALS */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start">{t.clientName}</th>
                  <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                  <th className="px-4 py-3 text-start">{lang === 'ar' ? 'كود الوحدة' : 'Unit Code'}</th>
                  <th className="px-4 py-3 text-start">{t.salesAgent}</th>
                  <th className="px-4 py-3 text-start">{t.dealValue}</th>
                  <th className="px-4 py-3 text-start">{t.commissionEarned}</th>
                  <th className="px-4 py-3 text-start">{t.closingDate}</th>
                  <th className="px-4 py-3 text-end">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-4 py-3.5 font-black text-slate-900">
                      <div>{deal.clientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{deal.clientPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {deal.project}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-amber-900">
                      {deal.unitCode}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {deal.salesAgent}
                    </td>
                    <td className="px-4 py-3.5 font-black text-slate-900">
                      {deal.dealValue.toLocaleString()} {t.egpCurrency}
                    </td>
                    <td className="px-4 py-3.5 font-black text-emerald-700">
                      {deal.commission.toLocaleString()} {t.egpCurrency} (2%)
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                      {deal.closingDate}
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {deal.dealStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
