import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Package,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  MapPin,
  ExternalLink,
  Phone,
  Zap,
  Sliders,
  Eye,
  ShieldCheck,
  Send,
  Navigation,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { Delivery, ReturnBooking } from '../../types';
import { COURIER_PROVIDERS } from '../../utils/courierAdapter';

export const DeliveryCommandCenter: React.FC = () => {
  const {
    deliveries,
    returnBookings,
    language,
    advanceDeliverySimulationStep,
    advanceReturnSimulationStep,
    confirmReturnInspection,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deliveries' | 'returns'>('deliveries');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourier, setFilterCourier] = useState<string>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<ReturnBooking | null>(null);

  // Metrics
  const totalDeliveries = deliveries.length;
  const inTransit = deliveries.filter(d => d.status === 'in_transit' || d.status === 'dispatched' || d.status === 'out_for_delivery').length;
  const delivered = deliveries.filter(d => d.status === 'delivered').length;
  const activeReturns = returnBookings.filter(r => r.status !== 'inspection_passed' && r.status !== 'completed').length;

  const filteredDeliveries = deliveries.filter((d) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) {
      if (filterCourier !== 'all' && d.courierProvider !== filterCourier) return false;
      return true;
    }

    const tId = (d.trackingId || '').toLowerCase();
    const rName = (d.reviewerName || '').toLowerCase();
    const sName = (d.storeName || '').toLowerCase();
    const pName = (d.productName || '').toLowerCase();
    const dist = (d.reviewerAddress?.district || d.deliveryAddress?.district || '').toLowerCase();

    const matchesSearch =
      tId.includes(q) ||
      rName.includes(q) ||
      sName.includes(q) ||
      pName.includes(q) ||
      dist.includes(q);

    if (!matchesSearch) return false;
    if (filterCourier !== 'all' && d.courierProvider !== filterCourier) return false;
    return true;
  });

  const filteredReturns = returnBookings.filter((r) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;

    const tId = (r.trackingId || (r as any).returnTrackingId || '').toLowerCase();
    const rName = (r.reviewerName || '').toLowerCase();
    const sName = (r.storeName || r.brandName || '').toLowerCase();
    const pName = ((r as any).productName || '').toLowerCase();

    return (
      tId.includes(q) ||
      rName.includes(q) ||
      sName.includes(q) ||
      pName.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>{language === 'bn' ? 'মোট পার্সেল' : 'Total Parcels'}</span>
          </div>
          <span className="text-2xl font-black text-white font-mono">{totalDeliveries}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{language === 'bn' ? 'চলমান / ট্রানজিট' : 'In Transit / Out'}</span>
          </div>
          <span className="text-2xl font-black text-amber-400 font-mono">{inTransit}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'সফল ডেলিভারি' : 'Delivered'}</span>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">{delivered}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>{language === 'bn' ? 'সক্রিয় রিটার্ন' : 'Active Returns'}</span>
          </div>
          <span className="text-2xl font-black text-purple-400 font-mono">{activeReturns}</span>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'deliveries'
                ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{language === 'bn' ? 'পণ্য ডেলিভারি ট্র্যাকিং' : 'Outbound Product Deliveries'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{deliveries.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'returns'
                ? 'bg-purple-500 text-slate-950 font-black shadow-lg shadow-purple-500/20'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'bn' ? 'রিটার্ন পার্সেল ও ওয়্যারহাউস' : 'Return Shipments & Inspection'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{returnBookings.length}</span>
          </button>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'ট্র্যাকিং আইডি, নাম বা জেলা...' : 'Tracking ID, reviewer, district...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50 transition-all"
          />
        </div>
      </div>

      {/* Courier Filters */}
      {activeTab === 'deliveries' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterCourier('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterCourier === 'all'
                ? 'bg-white/20 text-white font-bold'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সকল কুরিয়ার' : 'All Couriers'}
          </button>
          {Object.entries(COURIER_PROVIDERS).map(([key, c]) => (
            <button
              key={key}
              onClick={() => setFilterCourier(key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filterCourier === key
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
              }`}
            >
              <img src={c.logo} alt={c.nameEn} className="w-3.5 h-3.5 rounded-full object-cover" />
              <span>{language === 'bn' ? c.nameBn : c.nameEn}</span>
            </button>
          ))}
        </div>
      )}

      {/* Outbound Deliveries Table */}
      {activeTab === 'deliveries' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">{language === 'bn' ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'স্টোর ও পণ্য' : 'Store & Product'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'রিভিউয়ার ও জেলা' : 'Reviewer & Location'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'কুরিয়ার পার্টনার' : 'Courier'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'ডেলিভারি স্ট্যাটাস' : 'Status'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'ডিসপ্যাচ তারিখ' : 'Dispatched'}</th>
                  <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'লাইভ অ্যাকশন' : 'Live Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      {language === 'bn' ? 'কোনো ডেলিভারি রেকর্ড পাওয়া যায়নি।' : 'No delivery shipments found.'}
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((delivery) => {
                    const isDelivered = delivery.status === 'delivered';
                    const isInTransit = delivery.status === 'in_transit' || delivery.status === 'out_for_delivery' || delivery.status === 'dispatched';

                    return (
                      <tr
                        key={delivery.id}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        onClick={() => setSelectedDelivery(delivery)}
                      >
                        {/* Tracking ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-400 group-hover:underline">
                            {delivery.trackingId}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">
                            {delivery.id}
                          </div>
                        </td>

                        {/* Store & Product */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white max-w-[200px] truncate">
                            {delivery.productName}
                          </div>
                          <div className="text-[10px] text-white/50 truncate max-w-[200px]">
                            {delivery.storeName}
                          </div>
                        </td>

                        {/* Reviewer & Location */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">
                            {delivery.reviewerName}
                          </div>
                          <div className="text-[10px] text-white/40 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-400" />
                            <span>{delivery.reviewerAddress?.district || delivery.deliveryAddress?.district || 'Dhaka'}</span>
                          </div>
                        </td>

                        {/* Courier Partner */}
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-semibold text-white/90">
                            {delivery.courierName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                              isDelivered
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isInTransit
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            }`}
                          >
                            <Truck className="w-3 h-3" />
                            <span className="capitalize">{delivery.status.replace('_', ' ')}</span>
                          </span>
                        </td>

                        {/* Dispatched Date */}
                        <td className="py-3.5 px-3 font-mono text-white/60 text-[11px]">
                          {new Date(delivery.dispatchedAt).toLocaleDateString()}
                        </td>

                        {/* Live Action & Quick Step */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceDeliverySimulationStep(delivery.id);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] transition-all flex items-center gap-1 border border-amber-500/30"
                              title="Advance 1 step in live tracking simulation"
                            >
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>{language === 'bn' ? 'ধাপ বাড়ান' : 'Advance'}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDelivery(delivery);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-sky-500 hover:text-slate-950 text-white/80 text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'ট্র্যাক' : 'Track'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Shipments Table */}
      {activeTab === 'returns' && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">{language === 'bn' ? 'রিটার্ন ট্র্যাকিং' : 'Return Tracking'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'পণ্য ও ব্র্যান্ড' : 'Product & Store'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'রিভিউয়ার' : 'Reviewer'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'কুরিয়ার' : 'Courier'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'রিটার্ন স্ট্যাটাস' : 'Return Status'}</th>
                  <th className="py-3.5 px-3">{language === 'bn' ? 'ইন্সপেকশন অবস্থা' : 'Inspection'}</th>
                  <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      {language === 'bn' ? 'কোনো রিটার্ন পার্সেল পাওয়া যায়নি।' : 'No return shipments found.'}
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((ret) => {
                    const isPassed = ret.status === 'inspection_passed';

                    return (
                      <tr
                        key={ret.id}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        onClick={() => setSelectedReturn(ret)}
                      >
                        {/* Tracking */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-purple-400 group-hover:underline">
                            {ret.trackingId || (ret as any).returnTrackingId || 'RET-TRACK-001'}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">
                            {ret.id}
                          </div>
                        </td>

                        {/* Product & Store */}
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{ret.productName}</div>
                          <div className="text-[10px] text-white/50">{ret.storeName}</div>
                        </td>

                        {/* Reviewer */}
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">{ret.reviewerName}</div>
                        </td>

                        {/* Courier */}
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 font-semibold text-white/90">
                            {ret.courierName}
                          </span>
                        </td>

                        {/* Return Status */}
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {ret.status.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Inspection */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPassed
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : 'text-amber-400 bg-amber-500/10'
                            }`}
                          >
                            {isPassed ? '✓ Passed' : 'Pending Check'}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                advanceReturnSimulationStep(ret.id);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[11px] transition-all flex items-center gap-1 border border-purple-500/30"
                            >
                              <Zap className="w-3 h-3 text-purple-400" />
                              <span>{language === 'bn' ? 'ধাপ বাড়ান' : 'Advance'}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReturn(ret);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500 hover:text-slate-950 text-white/80 text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'ডিটেইলস' : 'Details'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Tracking Modal / Drawer */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-2xl">
                  🚚
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-mono">{selectedDelivery.trackingId}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 capitalize">
                      {selectedDelivery.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    {selectedDelivery.courierName} • Dispatched {new Date(selectedDelivery.dispatchedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDelivery(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Destination & Product Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
                  {language === 'bn' ? 'গন্তব্য ও রিভিউয়ার' : 'Destination & Reviewer'}
                </span>
                <div className="text-xs text-white/90 space-y-1">
                  <div className="font-bold text-white">{selectedDelivery.reviewerName}</div>
                  <div><span className="text-white/40">Phone:</span> {selectedDelivery.reviewerPhone || selectedDelivery.deliveryAddress?.phone || 'N/A'}</div>
                  <div><span className="text-white/40">Address:</span> {selectedDelivery.reviewerAddress?.fullAddress || selectedDelivery.deliveryAddress?.fullAddress || 'Dhaka, Bangladesh'}</div>
                  <div><span className="text-white/40">District:</span> {selectedDelivery.reviewerAddress?.district || selectedDelivery.deliveryAddress?.district || 'Dhaka'}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
                  {language === 'bn' ? 'পণ্য ও মার্চেন্ট' : 'Product & Merchant'}
                </span>
                <div className="text-xs text-white/90 space-y-1">
                  <div className="font-bold text-white">{selectedDelivery.productName}</div>
                  <div><span className="text-white/40">Store:</span> {selectedDelivery.storeName}</div>
                  <div><span className="text-white/40">Return Required:</span> <span className={selectedDelivery.isReturnable ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{selectedDelivery.isReturnable ? 'Yes (Prepaid Return)' : 'No (Gift to Reviewer)'}</span></div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Events Timeline */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center justify-between">
                <span>{language === 'bn' ? 'কুরিয়ার ট্র্যাকিং ইভেন্ট টাইমলাইন' : 'Live Courier Event Trail'}</span>
                <span className="text-sky-400 font-mono text-[11px]">Auto-Synced</span>
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {selectedDelivery.events.map((evt, idx) => (
                  <div key={evt.id || idx} className="flex items-start gap-4 relative pl-1">
                    <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center text-[10px] font-bold text-sky-400 z-10">
                      ✓
                    </div>
                    <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{evt.title}</span>
                        <span className="text-[10px] text-white/40 font-mono">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-white/70 text-[11px]">{evt.description}</p>
                      {evt.location && (
                        <div className="text-[10px] text-sky-400 font-mono mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Simulation Trigger */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-400 block">
                  {language === 'bn' ? '⚡ লাইভ সিমুলেশন অ্যাকশন' : '⚡ Live Simulation Controller'}
                </span>
                <p className="text-[11px] text-amber-200/70">
                  {language === 'bn'
                    ? 'কুরিয়ার স্ট্যাটাসকে এক ধাপ এগিয়ে নিন এবং ট্র্যাকিং ইভেন্ট যোগ করুন।'
                    : 'Advance courier tracking status to next lifecycle milestone.'}
                </p>
              </div>

              <button
                onClick={() => {
                  advanceDeliverySimulationStep(selectedDelivery.id);
                  const updated = deliveries.find(d => d.id === selectedDelivery.id);
                  if (updated) setSelectedDelivery(updated);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-amber-500/20"
              >
                <Zap className="w-4 h-4" />
                {language === 'bn' ? 'পরবর্তী ধাপে এগিয়ে দিন' : 'Advance Tracking Step'}
              </button>
            </div>

            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Inspection Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-mono">{selectedReturn.returnTrackingId}</h2>
                <p className="text-xs text-white/50">Return for {selectedReturn.productName} ({selectedReturn.storeName})</p>
              </div>
              <button
                onClick={() => setSelectedReturn(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Inspection Actions */}
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {language === 'bn' ? 'ওয়্যারহাউস রিটার্ন প্রোডাক্ট কন্ডিশন চেক' : 'Warehouse Return Condition Audit'}
              </h4>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    confirmReturnInspection(selectedReturn.id, true, 'পণ্য ও এক্সেসরিজ অক্ষত পাওয়া গেছে।');
                    setSelectedReturn(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'bn' ? 'ইন্সপেকশন অনুমোদন (Pass Condition)' : 'Pass Inspection & Settle'}
                </button>

                <button
                  onClick={() => {
                    const notes = prompt(
                      language === 'bn' ? 'পণ্যের ক্ষতির বিবরণ দিন:' : 'Describe product defect/issue:',
                      'চার্জিং কেবল নিখোঁজ অথবা বডিতে অতিরিক্ত স্ক্র্যাচ রয়েছে।'
                    );
                    if (notes) {
                      confirmReturnInspection(selectedReturn.id, false, notes);
                      setSelectedReturn(null);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-rose-500/30"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {language === 'bn' ? 'সমস্যা রিপোর্ট করুন (Flag Issue)' : 'Flag Damage / Issue'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
