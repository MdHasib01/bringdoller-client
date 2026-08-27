import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  Package,
  Layers,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  ShieldCheck,
  Eye,
  Sliders,
  Store as StoreIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { Store } from '../../types';

export const BrandsDirectory: React.FC = () => {
  const {
    stores,
    language,
    adminApproveStore,
    adminRequestStoreChanges,
    adminSuspendStore,
    businessOwners,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [changesNote, setChangesNote] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const filterChips = [
    { id: 'all', label: language === 'bn' ? 'সকল ব্র্যান্ড ও স্টোর' : 'All Stores & Brands', count: stores.length },
    { id: 'pending', label: language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Approval', count: stores.filter(s => s.verificationStatus === 'under_admin_review' || s.verificationStatus === 'submitted').length },
    { id: 'approved', label: language === 'bn' ? 'অনুমোদিত' : 'Approved Stores', count: stores.filter(s => s.verificationStatus === 'approved').length },
    { id: 'needs_attention', label: language === 'bn' ? 'সংশোধন প্রয়োজন' : 'Needs Changes', count: stores.filter(s => s.verificationStatus === 'changes_requested').length },
    { id: 'multi_store', label: language === 'bn' ? 'মাল্টি-স্টোর ওনার' : 'Multi-Store Owners', count: stores.filter(s => {
      const owner = businessOwners.find(o => o.id === s.ownerId);
      return (owner?.storeIds?.length || 0) > 1;
    }).length },
  ];

  const filteredStores = stores.filter((store) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) {
      if (filterStatus === 'pending') return store.verificationStatus === 'under_admin_review' || store.verificationStatus === 'submitted';
      if (filterStatus === 'approved') return store.verificationStatus === 'approved';
      if (filterStatus === 'needs_attention') return store.verificationStatus === 'changes_requested';
      if (filterStatus === 'multi_store') {
        const owner = businessOwners.find(o => o.id === store.ownerId);
        return (owner?.storeIds?.length || 0) > 1;
      }
      return true;
    }

    const storeName = (store.storeName || store.name || '').toLowerCase();
    const brandName = (store.brandName || '').toLowerCase();
    const ownerName = (store.ownerName || '').toLowerCase();
    const category = (store.businessCategory || store.category || '').toLowerCase();
    const tradeLicense = (store.tradeLicenseNumber || '').toLowerCase();

    const matchesSearch =
      storeName.includes(q) ||
      brandName.includes(q) ||
      ownerName.includes(q) ||
      category.includes(q) ||
      tradeLicense.includes(q);

    if (!matchesSearch) return false;

    if (filterStatus === 'pending') return store.verificationStatus === 'under_admin_review' || store.verificationStatus === 'submitted';
    if (filterStatus === 'approved') return store.verificationStatus === 'approved';
    if (filterStatus === 'needs_attention') return store.verificationStatus === 'changes_requested';
    if (filterStatus === 'multi_store') {
      const owner = businessOwners.find(o => o.id === store.ownerId);
      return (owner?.storeIds?.length || 0) > 1;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            {language === 'bn' ? 'ব্র্যান্ড ও স্টোর ডিরেক্টরি (Brands & Stores Directory)' : 'Brands & Multi-Store Directory'}
          </h3>
          <p className="text-xs text-white/50">
            {language === 'bn'
              ? 'ভেরিফায়েড বিজনেস ওনারদের অধীনে একাধিক ব্র্যান্ড/স্টোর পরিচালনা ও অ্যাডমিন অনুমোদন'
              : 'Verified business owners, multi-brand approvals, trade license verifications, and escrow'}
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'স্টোর, ওনার বা ট্রেড লাইসেন্স দিয়ে খুঁজুন...' : 'Search by store, owner, license...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterStatus(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === chip.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            <span>{chip.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterStatus === chip.id ? 'bg-black/20 text-slate-950 font-black' : 'bg-white/10 text-white/60'}`}>
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      {/* Stores Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{language === 'bn' ? 'স্টোর / ব্র্যান্ড' : 'Store / Brand'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'বিজনেস ওনার' : 'Business Owner'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'অনুমোদন স্ট্যাটাস' : 'Approval Status'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ক্যাম্পেইন ও পণ্য' : 'Campaigns / Prods'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'হায়ার্ড রিভিউয়ার' : 'Reviewers Hired'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'এস্ক্রো ব্যালেন্স' : 'Escrow Balance'}</th>
                <th className="py-3.5 px-3">{language === 'bn' ? 'ডেলিভারি সাকসেস' : 'Delivery Rate'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/40">
                    {language === 'bn' ? 'কোনো স্টোর পাওয়া যায়নি।' : 'No stores found.'}
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => {
                  const isApproved = store.verificationStatus === 'approved';
                  const isPending = store.verificationStatus === 'under_admin_review' || store.verificationStatus === 'submitted';

                  return (
                    <tr
                      key={store.id}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => setSelectedStore(store)}
                    >
                      {/* Store Photo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={store.storeLogoUrl || store.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80'}
                            alt={store.storeName || store.name || 'Store'}
                            className="w-10 h-10 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                              {store.storeName || store.name}
                            </div>
                            <div className="text-[11px] text-white/40 font-mono">
                              Lic: {store.tradeLicenseNumber || 'TRAD/DSCC/0192837'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Parent Owner */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                          <span>{store.ownerName}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400/80 font-mono">NID Verified Owner</span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium">
                          {store.businessCategory || store.category || 'General'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                              : store.verificationStatus === 'changes_requested'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isApproved ? 'Approved' : isPending ? 'Admin Review Required' : store.verificationStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Campaigns & Products */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">
                          {store.activeCampaignsCount || 0} {language === 'bn' ? 'ক্যাম্পেইন' : 'campaigns'}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {store.totalProductsCount || 0} {language === 'bn' ? 'পণ্য' : 'products'}
                        </div>
                      </td>

                      {/* Reviewers Hired */}
                      <td className="py-3.5 px-3 font-semibold text-white">
                        {store.totalReviewersHired || 0} {language === 'bn' ? 'জন' : 'hired'}
                      </td>

                      {/* Escrow Balance */}
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                        {formatBdt(store.escrowBalanceBdt || 0, language)}
                      </td>

                      {/* Delivery Rate */}
                      <td className="py-3.5 px-3">
                        <span className="text-sky-400 font-bold font-mono">
                          {store.deliverySuccessRate || 99}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStore(store);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-white/80 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'অডিট করুন' : 'Inspect & Approve'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Inspection & Approval Drawer */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStore.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80'}
                  alt={selectedStore.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{selectedStore.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {selectedStore.category}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    Owned by {selectedStore.ownerName} • Trade License: {selectedStore.tradeLicenseNumber || 'TRAD/DSCC/0192837'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStore(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Description & Hierarchy */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">
                {language === 'bn' ? 'স্টোর পরিচয় ও লক্ষ্য' : 'Store Description & Purpose'}
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                {selectedStore.description || 'Authentic certified premium merchant operating under BringDollar quality protocols.'}
              </p>
            </div>

            {/* Logistics & Pickup Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? 'পিকআপ ওয়্যারহাউস ঠিকানা' : 'Pickup Logistics Depot'}
                </h4>
                <div className="text-xs text-white/80 space-y-1">
                  {typeof selectedStore.pickupAddress === 'object' && selectedStore.pickupAddress ? (
                    <>
                      <div><span className="text-white/40">Contact:</span> {selectedStore.pickupAddress.contactPerson || selectedStore.ownerName} ({selectedStore.pickupAddress.phone || selectedStore.contactPhone})</div>
                      <div><span className="text-white/40">District:</span> {selectedStore.pickupAddress.district || 'Dhaka'}</div>
                      <div><span className="text-white/40">Address:</span> {selectedStore.pickupAddress.fullAddress || selectedStore.businessAddress}</div>
                      <div><span className="text-white/40">Preferred Courier:</span> <span className="uppercase text-emerald-400 font-mono font-bold">{selectedStore.pickupAddress.preferredCourier || 'Steadfast'}</span></div>
                    </>
                  ) : (
                    <div><span className="text-white/40">Address:</span> {selectedStore.defaultPickupAddress || selectedStore.businessAddress || 'Dhaka, Bangladesh'}</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  {language === 'bn' ? 'রিটার্ন রিসিভিং ওয়্যারহাউস' : 'Return Receiving Depot'}
                </h4>
                <div className="text-xs text-white/80 space-y-1">
                  {typeof selectedStore.returnAddress === 'object' && selectedStore.returnAddress ? (
                    <>
                      <div><span className="text-white/40">Contact:</span> {selectedStore.returnAddress.contactPerson || selectedStore.ownerName} ({selectedStore.returnAddress.phone || selectedStore.contactPhone})</div>
                      <div><span className="text-white/40">District:</span> {selectedStore.returnAddress.district || 'Dhaka'}</div>
                      <div><span className="text-white/40">Address:</span> {selectedStore.returnAddress.fullAddress || 'Dhaka Hub'}</div>
                      <div><span className="text-white/40">Courier:</span> <span className="uppercase text-sky-400 font-mono font-bold">{selectedStore.returnAddress.preferredCourier || 'Steadfast'}</span></div>
                    </>
                  ) : (
                    <div><span className="text-white/40">Address:</span> {typeof selectedStore.returnAddress === 'string' ? selectedStore.returnAddress : (selectedStore.businessAddress || 'Dhaka, Bangladesh')}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                {language === 'bn' ? 'স্টোর ম্যানেজমেন্ট টিম' : 'Store Management Team'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(selectedStore.teamMembers || []).map((member) => (
                  <div key={member.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{member.fullName || member.name || 'Team Member'}</span>
                      <span className="text-[10px] text-white/40">{member.email}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 uppercase text-[10px] font-mono">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Approval Actions */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {language === 'bn' ? 'অ্যাডমিন স্টোর অনুমোদন সিদ্ধান্ত' : 'Admin Store Verification Decision'}
              </h4>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      adminApproveStore(selectedStore.id);
                      setSelectedStore(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'bn' ? 'স্টোর অনুমোদন করুন (Approve Store)' : 'Approve Store for Live Campaigns'}
                  </button>

                  <button
                    onClick={() => {
                      const note = prompt(
                        language === 'bn' ? 'স্টোরে কী সংশোধন প্রয়োজন লিখে জানান:' : 'Enter revision notes for brand owner:',
                        'ট্রেড লাইসেন্সের স্পষ্ট কপি এবং রিটার্ন ওয়্যারহাউসের বিকল্প ফোন নম্বর প্রদান করুন।'
                      );
                      if (note) {
                        adminRequestStoreChanges(selectedStore.id, note);
                        setSelectedStore(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-purple-500/30"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {language === 'bn' ? 'পরিবর্তন চান (Request Changes)' : 'Request Revision Notes'}
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt(
                        language === 'bn' ? 'স্থগিতাদেশের কারণ উল্লেখ করুন:' : 'Reason for suspension:',
                        'Fraudulent or non-verified brand claims'
                      );
                      if (reason) {
                        adminSuspendStore(selectedStore.id, reason);
                        setSelectedStore(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-rose-500/30"
                  >
                    <XCircle className="w-4 h-4" />
                    {language === 'bn' ? 'স্থগিত করুন (Suspend)' : 'Suspend Store'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Close */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStore(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Drawer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
