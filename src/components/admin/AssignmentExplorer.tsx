import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Package,
  Sparkles,
  Users,
  Truck,
  Video,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';

export const AssignmentExplorer: React.FC = () => {
  const {
    businessOwners,
    stores,
    products,
    campaigns,
    assignments,
    deliveries,
    returnBookings,
    language,
  } = useApp();

  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(businessOwners[0]?.id || 'owner-1');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || 'camp-1');

  const currentOwner = businessOwners.find(o => o.id === selectedOwnerId) || businessOwners[0];
  const ownerStores = stores.filter(s => s.ownerId === selectedOwnerId);
  const currentStore = stores.find(s => s.id === selectedStoreId) || ownerStores[0] || stores[0];
  const storeProducts = products.filter(p => p.storeId === currentStore?.id || p.brandId === currentStore?.id);
  const storeCampaigns = campaigns.filter(c => {
    if (!currentStore) return true;
    if (c.brandId === currentStore.id) return true;
    const sName = (currentStore.storeName || currentStore.name || '').toLowerCase();
    const bName = (currentStore.brandName || '').toLowerCase();
    const cBrand = (c.brandName || '').toLowerCase();
    if (cBrand && (sName.includes(cBrand) || bName.includes(cBrand) || cBrand.includes(bName))) return true;
    return false;
  });
  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId) || storeCampaigns[0] || campaigns[0];
  const campaignAssignments = assignments.filter(a => a.campaignId === currentCampaign?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          {language === 'bn' ? 'অ্যাসাইনমেন্ট ও প্ল্যাটফর্ম হায়ারার্কি এক্সপ্লোরার' : 'Assignment & Multi-Tier Hierarchy Explorer'}
        </h3>
        <p className="text-xs text-white/50">
          {language === 'bn'
            ? 'Verified Owner → Store/Brand → Product → Campaign → Assignment → Delivery → Submission → Payment & Return চেইন ট্র্যাকিং'
            : 'Trace the complete relationship chain from verified merchant down to parcel delivery, video review QA, and return escrow.'}
        </p>
      </div>

      {/* Visual Hierarchy Flow Map */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {language === 'bn' ? 'লাইভ বিজনেস হায়ারার্কি ম্যাপ' : 'Live Platform Hierarchy Graph'}
        </h4>

        {/* Step 1: Verified Owner */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono">1</span>
            <span>{language === 'bn' ? 'ভেরিফায়েড বিজনেস ওনার (Verified Owner)' : 'Verified Business Owner'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {businessOwners.map((owner) => (
              <button
                key={owner.id}
                onClick={() => {
                  setSelectedOwnerId(owner.id);
                  const firstStore = stores.find(s => s.ownerId === owner.id);
                  if (firstStore) setSelectedStoreId(firstStore.id);
                }}
                className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                  selectedOwnerId === owner.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{owner.fullName}</span>
                  </div>
                  <div className="text-[11px] text-white/50 font-mono mt-0.5">
                    {owner.email} • {owner.storeIds.length} {language === 'bn' ? 'টি স্টোর' : 'Managed Stores'}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                  {owner.accountStatus || owner.verificationStatus || 'Active'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            ↓
          </div>
        </div>

        {/* Step 2: Multiple Stores */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono">2</span>
            <span>{language === 'bn' ? 'ওনারের অধীনস্থ স্টোর / ব্র্যান্ড সমূহ' : 'Stores & Brands Under Owner'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ownerStores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`p-4 rounded-2xl text-left border transition-all space-y-2 ${
                  selectedStoreId === store.id
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={store.storeLogoUrl || store.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80'}
                    alt={store.storeName || store.name || 'Store'}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                  />
                  <div className="overflow-hidden">
                    <div className="font-bold text-white text-xs truncate">{store.storeName || store.name}</div>
                    <div className="text-[10px] text-white/40">{store.businessCategory || store.category}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/5">
                  <span className="text-emerald-400 font-mono font-bold">{formatBdt(store.escrowBalanceBdt || 0, language)}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${store.verificationStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {store.verificationStatus}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            ↓
          </div>
        </div>

        {/* Step 3: Active Campaigns & Products */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono">3</span>
            <span>{language === 'bn' ? 'রিভিউ ক্যাম্পেইন ও পণ্য' : 'Review Campaigns & Products'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {campaigns.map((camp) => (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                  selectedCampaignId === camp.id
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <img
                  src={camp.productImageUrl || camp.brandLogoUrl}
                  alt={camp.title}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-white text-xs line-clamp-1">{camp.title}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{camp.productName}</div>
                  <div className="flex items-center gap-3 text-[10px] text-emerald-400 font-mono mt-2">
                    <span>Reward: {formatBdt(camp.reviewerRewardBdt, language)}</span>
                    <span>•</span>
                    <span className="text-sky-400">{camp.reviewersHired || 0} Reviewers Hired</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Down Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            ↓
          </div>
        </div>

        {/* Step 4: Active Reviewer Assignments, Deliveries & Returns */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono">4</span>
            <span>{language === 'bn' ? 'রিভিউয়ার অ্যাসাইনমেন্ট, পার্সেল ডেলিভারি ও রিটার্ন' : 'Assignments, Courier Shipments & Return Escrow'}</span>
          </div>

          <div className="space-y-3">
            {campaignAssignments.length === 0 ? (
              <div className="p-6 text-center text-white/40 bg-white/5 rounded-2xl border border-white/10 text-xs">
                {language === 'bn' ? 'এই ক্যাম্পেইনে এখনও কোনো রিভিউয়ার অ্যাসাইন করা হয়নি।' : 'No assignments active under this campaign yet.'}
              </div>
            ) : (
              campaignAssignments.map((asgn) => {
                const delivery = deliveries.find(d => d.assignmentId === asgn.id || d.id === asgn.deliveryId);
                const returnBooking = returnBookings.find(r => r.assignmentId === asgn.id);

                return (
                  <div
                    key={asgn.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img
                          src={asgn.reviewerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={asgn.reviewerName}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{asgn.reviewerName}</span>
                            <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                              Score: {asgn.reviewerTrustScore}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">Assignment ID: {asgn.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 font-bold font-mono text-[11px] uppercase">
                          {asgn.status.replace('_', ' ')}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {formatBdt(asgn.payoutBdt, language)}
                        </span>
                      </div>
                    </div>

                    {/* Sub-cards: Delivery & Return */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Outbound Delivery */}
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-sky-300 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" /> Outbound Parcel
                          </span>
                          <span className="font-mono text-white/60">{asgn.shipment?.courierName || 'Steadfast BD'}</span>
                        </div>
                        <div className="font-mono text-xs text-sky-400 font-bold">
                          {asgn.shipment?.trackingId || 'ST-94827104'}
                        </div>
                        <div className="text-[10px] text-white/50">
                          Status: <span className="text-emerald-400 font-bold">{asgn.deliveryStatus || 'Delivered'}</span>
                        </div>
                      </div>

                      {/* Return Parcel */}
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-purple-300 flex items-center gap-1">
                            <RotateCcw className="w-3.5 h-3.5" /> Return Logistics
                          </span>
                          <span className="font-mono text-white/60">{asgn.isReturnRequired ? 'Required' : 'Not Required'}</span>
                        </div>
                        <div className="font-mono text-xs text-purple-400 font-bold">
                          {asgn.returnBookingId || (asgn.isReturnRequired ? 'Booking in Progress' : 'Kept by Reviewer')}
                        </div>
                        <div className="text-[10px] text-white/50">
                          Condition Check: <span className="text-amber-400 font-bold">{asgn.returnStatus || 'Awaiting Submission'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
