import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ChevronDown,
  Plus,
  Check,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  Store as StoreIcon,
} from 'lucide-react';
import { formatBdt } from '../../utils/formatters';

export const StoreSwitcher: React.FC = () => {
  const {
    stores,
    activeStoreId,
    setActiveStoreId,
    activeStore,
    addStore,
    language,
    currentRole,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);

  // New store form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Beauty & Skincare');
  const [description, setDescription] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80');
  const [pickupContact, setPickupContact] = useState('Farhan Chowdhury');
  const [pickupPhone, setPickupPhone] = useState('+880 1711-223344');
  const [pickupDistrict, setPickupDistrict] = useState('Dhaka');
  const [pickupAddress, setPickupAddress] = useState('House 42, Road 11, Banani, Dhaka');
  const [returnContact, setReturnContact] = useState('Central Warehouse Team');
  const [returnPhone, setReturnPhone] = useState('+880 1811-998877');
  const [returnDistrict, setReturnDistrict] = useState('Gazipur');
  const [returnAddress, setReturnAddress] = useState('Plot 19, Sector 4, Tongi I/A, Gazipur');

  // If not brand role, do not render switcher
  if (currentRole !== 'brand') {
    return null;
  }

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStore({
      name,
      category,
      description,
      tradeLicenseNumber,
      logoUrl,
      ownerId: activeStore?.ownerId || 'owner-1',
      ownerName: activeStore?.ownerName || 'Farhan Chowdhury (Verified Owner)',
      pickupAddress: {
        contactPerson: pickupContact,
        phone: pickupPhone,
        district: pickupDistrict,
        fullAddress: pickupAddress,
        preferredCourier: 'steadfast',
      },
      returnAddress: {
        contactPerson: returnContact,
        phone: returnPhone,
        district: returnDistrict,
        fullAddress: returnAddress,
        preferredCourier: 'steadfast',
      },
      teamMembers: [
        {
          id: 'tm-new-1',
          name: activeStore?.ownerName || 'Farhan Chowdhury',
          email: 'owner@brand.com',
          role: 'owner',
        },
      ],
    });

    setShowNewStoreModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="relative">
      {/* Switcher Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all group"
      >
        <img
          src={activeStore?.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80'}
          alt={activeStore?.name || 'Store'}
          className="w-5 h-5 rounded-md object-cover border border-white/20"
        />
        <div className="text-left hidden sm:block max-w-[130px]">
          <span className="block truncate text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors">
            {activeStore?.name || 'Aura Naturals BD'}
          </span>
          <span className="block text-[9px] text-white/40 font-mono">
            {activeStore?.verificationStatus === 'approved' ? '✓ Approved' : 'Review Pending'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl z-50 backdrop-blur-2xl space-y-1">
            <div className="px-3 py-2 border-b border-white/5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                {language === 'bn' ? 'ম্যানেজড স্টোর ও ব্র্যান্ড' : 'Managed Stores & Brands'}
              </span>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Business Owner Account</span>
              </div>
            </div>

            {/* List of Stores */}
            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {stores.map((store) => {
                const isSelected = store.id === activeStoreId;
                const isApproved = store.verificationStatus === 'approved';

                return (
                  <button
                    key={store.id}
                    onClick={() => {
                      setActiveStoreId(store.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                        : 'hover:bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="w-8 h-8 rounded-lg object-cover border border-white/10"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs truncate text-white">{store.name}</div>
                        <div className="text-[10px] text-white/40 flex items-center gap-1">
                          <span>{store.category}</span>
                          <span>•</span>
                          <span className={isApproved ? 'text-emerald-400' : 'text-amber-400'}>
                            {isApproved ? 'Approved' : 'Under Review'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Add New Store Button */}
            <div className="pt-1 border-t border-white/5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowNewStoreModal(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '+ নতুন স্টোর / ব্র্যান্ড যোগ করুন' : '+ Add New Store / Brand'}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* New Store Creation Modal */}
      {showNewStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
                  🏪
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    {language === 'bn' ? 'নতুন স্টোর বা ব্র্যান্ড তৈরি করুন' : 'Register New Store or Brand'}
                  </h2>
                  <p className="text-xs text-white/50">
                    {language === 'bn'
                      ? 'প্রতিটি নতুন স্টোর অ্যাডমিন কর্তৃক যাচাই ও অনুমোদন করা আবশ্যক'
                      : 'Every new brand requires Admin approval before launching live campaigns'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNewStoreModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === 'bn' ? 'স্টোর পরিচয় ও ট্রেড লাইসেন্স' : 'Store Identity & Trade License'}
                </h4>

                <div>
                  <label className="block text-white/70 mb-1 font-semibold">{language === 'bn' ? 'স্টোর / ব্র্যান্ডের নাম:' : 'Store / Brand Name *'}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Saffron Organics BD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1 font-semibold">{language === 'bn' ? 'ক্যাটাগরি:' : 'Category *'}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option>Beauty & Skincare</option>
                      <option>Smart Wearables & Audio</option>
                      <option>Leather Goods & Footwear</option>
                      <option>Electronics & Gadgets</option>
                      <option>Health & Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1 font-semibold">{language === 'bn' ? 'ট্রেড লাইসেন্স নম্বর:' : 'Trade License Number *'}</label>
                    <input
                      type="text"
                      required
                      value={tradeLicenseNumber}
                      onChange={(e) => setTradeLicenseNumber(e.target.value)}
                      placeholder="e.g. TRAD/DNCC/0827104"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-semibold">{language === 'bn' ? 'লোগো ইমেজ URL:' : 'Logo Image URL'}</label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-[11px] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-semibold">{language === 'bn' ? 'ব্র্যান্ডের সংক্ষিপ্ত পরিচিতি:' : 'Brand Description'}</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Authentic natural organic beauty brand crafted for Bangladeshi consumers..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>
              </div>

              {/* Logistics Addresses */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {language === 'bn' ? 'লজিস্টিক ও ওয়্যারহাউস ঠিকানা' : 'Logistics & Warehouse Depots'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 mb-1">Pickup Contact & Phone</label>
                    <input
                      type="text"
                      value={pickupContact}
                      onChange={(e) => setPickupContact(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs mb-1"
                    />
                    <input
                      type="text"
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Return Depot Contact & Phone</label>
                    <input
                      type="text"
                      value={returnContact}
                      onChange={(e) => setReturnContact(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs mb-1"
                    />
                    <input
                      type="text"
                      value={returnPhone}
                      onChange={(e) => setReturnPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'bn'
                    ? 'স্টোর সাবমিট করার পর আমাদের অ্যাডমিন টিম ট্রেড লাইসেন্স যাচাই করবে। অনুমোদনের পর আপনি ক্যাম্পেইন চালু করতে পারবেন।'
                    : 'After submission, BringDollar compliance admins will verify your trade license. Once approved, you can launch campaigns.'}
                </span>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoreModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'bn' ? 'স্টোর সাবমিট করুন' : 'Submit Store for Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
