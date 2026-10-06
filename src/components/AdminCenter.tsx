import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { UserRole } from '../types/crm';
import { Shield, Users, Key, Settings, CheckCircle2, Lock, Sliders } from 'lucide-react';

export const AdminCenter: React.FC = () => {
  const { salesAgents, switchRole, currentUser, t, lang } = useCrm();

  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'roles' | 'rules'>('employees');

  const permissionsMatrix: { module: string; admin: boolean; manager: boolean; leader: boolean; agent: boolean }[] = [
    { module: lang === 'ar' ? 'عرض وإضافة العملاء' : 'View & Add Leads', admin: true, manager: true, leader: true, agent: true },
    { module: lang === 'ar' ? 'تعديل وحذف العملاء' : 'Edit & Delete Leads', admin: true, manager: true, leader: true, agent: false },
    { module: lang === 'ar' ? 'تقارير السيلز والاتصالات' : 'Sales Reports & Calls', admin: true, manager: true, leader: true, agent: true },
    { module: lang === 'ar' ? 'اعتماد الحجوزات والتعاقدات' : 'Approve Deals & Reservations', admin: true, manager: true, leader: false, agent: false },
    { module: lang === 'ar' ? 'تعديل أسعار ومخزون الوحدات' : 'Modify Units & Prices', admin: true, manager: false, leader: false, agent: false },
    { module: lang === 'ar' ? 'تصدير التقارير الإكسيل' : 'Export Reports & CSV', admin: true, manager: true, leader: true, agent: false },
    { module: lang === 'ar' ? 'قواعد التوزيع التلقائي' : 'Lead Assignment Rules', admin: true, manager: true, leader: false, agent: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navAdmin}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-900 text-amber-300">
              Security & RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'إدارة حسابات الموظفين، مصفوفة الصلاحيات، وقواعد توزيع الفرص البيعية'
              : 'User accounts governance, access controls matrix, and business rules'}
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('employees')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'employees' ? 'bg-slate-900 text-amber-300 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'ar' ? 'فريق العمل' : 'Staff'}
          </button>
          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'roles' ? 'bg-slate-900 text-amber-300 shadow-xs' : 'text-slate-600'
            }`}
          >
            {lang === 'ar' ? 'مصفوفة الصلاحيات' : 'Permissions Matrix'}
          </button>
        </div>
      </div>

      {activeSubTab === 'employees' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-xs text-slate-900">
              {lang === 'ar' ? 'حسابات مستشاري ومسؤولي مبيعات Heaven Real Estate' : 'Heaven Real Estate Staff Directory'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 text-start">{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="p-3 text-start">{lang === 'ar' ? 'البريد' : 'Email'}</th>
                  <th className="p-3 text-start">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="p-3 text-start">{lang === 'ar' ? 'الدور الوظيفي' : 'Role'}</th>
                  <th className="p-3 text-start">{lang === 'ar' ? 'الفريق' : 'Team'}</th>
                  <th className="p-3 text-end">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesAgents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-amber-50/20">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <img src={ag.avatar} alt={ag.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{ag.name}</span>
                    </td>
                    <td className="p-3 text-slate-600">{ag.email}</td>
                    <td className="p-3 font-mono text-slate-600" dir="ltr">{ag.phone}</td>
                    <td className="p-3 font-bold text-amber-900">{ag.role}</td>
                    <td className="p-3 text-slate-700">{ag.team}</td>
                    <td className="p-3 text-end">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        نشط (Active)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* PERMISSIONS MATRIX */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-black text-xs text-slate-900">
              {lang === 'ar' ? 'مصفوفة التحكم بالوصول والأذونات (Role-Based Access Control)' : 'RBAC Access Matrix'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3 text-start">{lang === 'ar' ? 'الوحدة / الإجراء' : 'Module / Action'}</th>
                  <th className="p-3 text-center">Admin</th>
                  <th className="p-3 text-center">Sales Manager</th>
                  <th className="p-3 text-center">Team Leader</th>
                  <th className="p-3 text-center">Sales Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((pm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{pm.module}</td>
                    <td className="p-3 text-center">
                      <span className={`font-black ${pm.admin ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {pm.admin ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-black ${pm.manager ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {pm.manager ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-black ${pm.leader ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {pm.leader ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-black ${pm.agent ? 'text-emerald-600' : 'text-slate-300'}`}>
                        {pm.agent ? '✓' : '—'}
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
