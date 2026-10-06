import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Unit, UnitType, UnitAvailability } from '../types/crm';
import { 
  Building2, Search, Filter, Layers, CheckCircle2, 
  MapPin, Calendar, DollarSign, Share2, BadgePercent,
  SlidersHorizontal, Eye, Plus
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { projects, units, updateUnitAvailability, t, lang, addReservation, leads } = useCrm();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(30000000);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitForReserve, setSelectedUnitForReserve] = useState<Unit | null>(null);

  // Filter logic
  const filteredUnits = units.filter((u) => {
    if (selectedProjectId !== 'ALL' && u.projectId !== selectedProjectId) return false;
    if (filterType !== 'ALL' && u.unitType !== filterType) return false;
    if (filterBedrooms !== 'ALL' && u.bedrooms !== Number(filterBedrooms)) return false;
    if (u.price > maxBudget) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        u.unitCode.toLowerCase().includes(q) ||
        u.projectName.toLowerCase().includes(q) ||
        u.view.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleReserve = (unit: Unit) => {
    const lead = leads[0]; // demo link
    addReservation({
      leadId: lead.id,
      clientName: lead.clientName,
      clientPhone: lead.mobileNumber,
      project: unit.projectName,
      unitCode: unit.unitCode,
      salesAgent: lead.assignedSalesAgent,
      unitPrice: unit.price,
      reservationAmount: Math.round(unit.price * 0.02),
      reservationDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      reservationStatus: 'Active'
    });
    alert(lang === 'ar' ? `تم حجز الوحدة ${unit.unitCode} بنجاح!` : `Unit ${unit.unitCode} reserved!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900">{t.navInventory}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? 'مشاريع الإسكندرية والساحل الشمالي، تفاصيل المشروعات، الأسعار، وأنظمة السداد المتاحة'
              : 'Alexandria & North Coast developments, project specs, pricing and installment models'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300">
            {units.filter((u) => u.availability === 'Available').length} {lang === 'ar' ? 'وحدة متاحة' : 'Units Available'}
          </span>
        </div>
      </div>

      {/* Projects Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(isSelected ? 'ALL' : proj.id)}
              className={`rounded-3xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={proj.imageUrl}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-amber-400/30">
                  {proj.availableUnits} {lang === 'ar' ? 'وحدة متاحة' : 'Available'}
                </div>
                <div className="absolute bottom-3 start-3 end-3 text-white">
                  <span className="text-[10px] font-semibold text-amber-400">{proj.developer}</span>
                  <h3 className="text-sm font-black text-white">{proj.name}</h3>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{proj.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'يبدأ من:' : 'Starting:'}</span>
                    <span className="font-black text-amber-900">{proj.startingPrice.toLocaleString()} {t.egpCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'نظام السداد:' : 'Payment Plan:'}</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{proj.paymentPlans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'الاستلام:' : 'Delivery:'}</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{proj.deliveryDate}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected
                      ? (lang === 'ar' ? '✓ جاري عرض وحدات هذا المشروع' : '✓ Showing Project Units')
                      : (lang === 'ar' ? 'تصفية وحدات هذا المشروع' : 'Filter Units for this Project')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Units Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <h3 className="font-black text-xs text-slate-900">
              {lang === 'ar' ? 'فلترة والبحث السريع في وحدات المشاريع' : 'Smart Units Search & Filters'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            {filteredUnits.length} {lang === 'ar' ? 'وحدة متاحة' : 'units'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.unitType}</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="ALL">{lang === 'ar' ? 'جميع الأنواع' : 'All Unit Types'}</option>
              {['Apartment', 'Duplex', 'Chalet', 'Penthouse', 'Standalone Villa', 'Townhouse'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">{t.bedroomsCount}</label>
            <select
              value={filterBedrooms}
              onChange={(e) => setFilterBedrooms(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="ALL">{lang === 'ar' ? 'أي عدد غرف' : 'Any Bedrooms'}</option>
              {[2, 3, 4, 5].map((b) => (
                <option key={b} value={b}>{b} {lang === 'ar' ? 'غرف' : 'Rooms'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">
              {lang === 'ar' ? 'أقصى ميزانية:' : 'Max Budget:'} {(maxBudget / 1000000).toFixed(1)}M {t.egpCurrency}
            </label>
            <input
              type="range"
              min={3000000}
              max={25000000}
              step={500000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'بحث بالكود أو الإطلالة' : 'Search Code / View'}</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'مثال: NC-102، Lake...' : 'e.g. NC-102, Lagoon...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'كود الوحدة' : 'Unit Code'}</th>
                <th className="px-4 py-3 text-start">{t.interestedProject}</th>
                <th className="px-4 py-3 text-start">{t.unitType}</th>
                <th className="px-4 py-3 text-start">{t.areaSqm}</th>
                <th className="px-4 py-3 text-start">{t.bedroomsCount}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'الدور والإطلالة' : 'Floor & View'}</th>
                <th className="px-4 py-3 text-start">{t.unitPrice}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'المقدم والتقسيط' : 'Down Payment'}</th>
                <th className="px-4 py-3 text-start">{lang === 'ar' ? 'حالة الإتاحة' : 'Availability'}</th>
                <th className="px-4 py-3 text-end">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="px-4 py-3 font-black text-slate-900 font-mono">
                    {u.unitCode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {u.projectName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                      {u.unitType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    {u.area} م²
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {u.bedrooms} غرف • {u.bathrooms} حمام
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="font-semibold">{lang === 'ar' ? `الدور ${u.floor}` : `Floor ${u.floor}`}</div>
                    <div className="text-[10px] text-slate-400">{u.view}</div>
                  </td>
                  <td className="px-4 py-3 font-black text-amber-900">
                    {u.price.toLocaleString()} {t.egpCurrency}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <div className="font-bold">{u.downPayment.toLocaleString()} {t.egpCurrency}</div>
                    <div className="text-[10px] text-slate-400">{u.installmentYears} {lang === 'ar' ? 'سنوات أقساط' : 'yrs'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.availability}
                      onChange={(e) => updateUnitAvailability(u.id, e.target.value as UnitAvailability)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                        u.availability === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : u.availability === 'Reserved'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : u.availability === 'Sold'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Available">{lang === 'ar' ? 'متاحة' : 'Available'}</option>
                      <option value="Reserved">{lang === 'ar' ? 'محجوزة' : 'Reserved'}</option>
                      <option value="Sold">{lang === 'ar' ? 'مباعة' : 'Sold'}</option>
                      <option value="On Hold">{lang === 'ar' ? 'معلقة' : 'On Hold'}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.availability === 'Available' && (
                        <button
                          onClick={() => handleReserve(u)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <BadgePercent className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'حجز' : 'Reserve'}</span>
                        </button>
                      )}
                    </div>
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
