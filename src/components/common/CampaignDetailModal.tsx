import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Package,
  FileText,
  DollarSign,
  Truck,
  Video,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  Award,
  Coins,
  Check,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Eye,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Campaign, CampaignDoItem, CampaignDontItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface CampaignDetailModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onApply: (campaignId: string) => void;
  isApplied?: boolean;
  hasAssignment?: boolean;
  readOnly?: boolean;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onApply,
  isApplied = false,
  hasAssignment = false,
  readOnly = false,
}) => {
  const { language, reviewerProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'product' | 'dos_donts' | 'requirements' | 'delivery' | 'payment'>('overview');
  
  // Tracking whether reviewer viewed mandatory tabs
  const [hasViewedProductDetails, setHasViewedProductDetails] = useState<boolean>(false);
  const [hasViewedDosAndDonts, setHasViewedDosAndDonts] = useState<boolean>(false);
  const [readDos, setReadDos] = useState<string[]>([]);
  const [readDonts, setReadDonts] = useState<string[]>([]);
  const [isTermsAcknowledged, setIsTermsAcknowledged] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState<boolean>(false);

  // Extract brief and product details
  const brief = campaign.brief;
  const productDetails = campaign.brief.productDetails || campaign.productDetails;
  const dos: CampaignDoItem[] = brief.dos || [];
  const donts: CampaignDontItem[] = brief.donts || [];

  const mandatoryDos = dos.filter((d) => d.isMandatory);
  const mandatoryDonts = donts.filter((d) => d.isMandatory);
  const totalMandatoryCount = mandatoryDos.length + mandatoryDonts.length;

  const mandatoryDosReadCount = mandatoryDos.filter((d) => readDos.includes(d.id)).length;
  const mandatoryDontsReadCount = mandatoryDonts.filter((d) => readDonts.includes(d.id)).length;
  const totalReadCount = mandatoryDosReadCount + mandatoryDontsReadCount;

  const isReadingComplete = totalMandatoryCount === 0 || totalReadCount >= totalMandatoryCount;
  const canApply = hasViewedProductDetails && hasViewedDosAndDonts && isReadingComplete && isTermsAcknowledged;

  useEffect(() => {
    if (activeTab === 'product') {
      setHasViewedProductDetails(true);
    } else if (activeTab === 'dos_donts') {
      setHasViewedDosAndDonts(true);
    }
  }, [activeTab]);

  const toggleDoRead = (id: string) => {
    setReadDos((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleDontRead = (id: string) => {
    setReadDonts((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const markAllAsRead = () => {
    setReadDos(dos.map((d) => d.id));
    setReadDonts(donts.map((d) => d.id));
  };

  if (!isOpen) return null;

  const images = productDetails?.images && productDetails.images.length > 0 
    ? productDetails.images 
    : [campaign.productImageUrl];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3.5 pr-6">
            <img
              src={campaign.brandLogoUrl}
              alt={campaign.brandName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  {campaign.category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {campaign.brandName}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono">
                  Brief {brief.briefVersion || 'v1.0'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                {campaign.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Tabs Navigation Bar */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2 border-b border-slate-800 bg-slate-900/90 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'product'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            Product Details
            {!hasViewedProductDetails && !readOnly && !isApplied && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dos_donts')}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'dos_donts'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Do’s and Don’ts
            {!hasViewedDosAndDonts && !readOnly && !isApplied && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            {totalMandatoryCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 ml-0.5 font-mono">
                {totalReadCount}/{totalMandatoryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            Requirements
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            Delivery & Return
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payment & Escrow
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[58vh] sm:max-h-[62vh] space-y-6 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Reviewer Payout</span>
                  <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                    ৳{campaign.reviewerRewardBdt.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Escrow Guaranteed</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Product Retail Value</span>
                  <span className="text-lg font-bold text-white">
                    ৳{campaign.productRetailPriceBdt.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-amber-400 block mt-0.5">
                    {campaign.isReturnRequired ? 'Returnable Unit' : 'Keep as Gift'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Testing Duration</span>
                  <span className="text-lg font-bold text-sky-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {brief.testingDurationDays} Days
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Real wear testing</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Rewards</span>
                  <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <span>+{campaign.careerXpReward} XP</span>
                    <span className="text-slate-600">•</span>
                    <span>+{campaign.rewardCoinsReward} Coins</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">On video approval</span>
                </div>
              </div>

              {/* Campaign Objective & Summary */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Campaign Objective
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {brief.objective}
                </p>
              </div>

              {/* Key Honest Review Policy */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  BringDollar Unbiased Review Agreement
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {brief.honestReviewGuidelinesBn}
                </p>
                <p className="text-slate-400 text-xs italic">
                  "{brief.honestReviewGuidelinesEn}"
                </p>
              </div>

              {/* Progress & Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Reviewers Target</span>
                  <span className="font-semibold text-white mt-1 block">
                    {campaign.reviewersHired} / {campaign.totalReviewersTarget} Hired
                  </span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Required Reviewer Level</span>
                  <span className="font-semibold text-emerald-400 mt-1 block capitalize">
                    {campaign.minReviewerLevel.replace('_', ' ')} (Min {campaign.minTrustScore}% Trust)
                  </span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Application Deadline</span>
                  <span className="font-semibold text-white mt-1 block">
                    {new Date(campaign.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT DETAILS */}
          {activeTab === 'product' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Product Gallery */}
              <div className="space-y-3">
                <div className="h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative">
                  <img
                    src={images[selectedImageIndex] || campaign.productImageUrl}
                    alt={productDetails?.productName || campaign.productName}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-slate-300 border border-slate-700">
                    ৳{productDetails?.priceBdt || campaign.productRetailPriceBdt} BDT
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-950 ${
                          selectedImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-slate-800 opacity-60'
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Block */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    {productDetails?.productName || campaign.productName}
                  </h3>
                  {productDetails?.websiteUrl && (
                    <a
                      href={productDetails.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Official Page <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {productDetails?.description || 'Authentic product verified by BringDollar Quality Operations.'}
                </p>
              </div>

              {/* Specifications & Purpose Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Purpose</h4>
                  <p className="text-slate-300 text-sm">
                    {productDetails?.purpose || 'Consumer testing and unbiased multi-day utility evaluation.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Specifications & Size</h4>
                  <p className="text-slate-300 text-sm">
                    {productDetails?.specifications || 'Standard manufacturer packaging with full certification.'}
                  </p>
                  {productDetails?.sizeOrQuantity && (
                    <div className="text-xs text-emerald-400 font-mono mt-1">
                      Pack Size: {productDetails.sizeOrQuantity}
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features Bullets */}
              {productDetails?.keyFeatures && productDetails.keyFeatures.length > 0 && (
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Features to Test</h4>
                  <ul className="space-y-1.5">
                    {productDetails.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step-by-Step Usage Instructions */}
              {productDetails?.usageInstructions && productDetails.usageInstructions.length > 0 && (
                <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step-by-Step Usage Guidelines</h4>
                  <ol className="space-y-2 list-decimal list-inside text-slate-300 text-sm">
                    {productDetails.usageInstructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Safety, Storage & Intended Users */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Safety & Precautions
                  </span>
                  <p className="text-xs text-slate-300">
                    {productDetails?.safetyInstructions || 'Follow normal cosmetic and gadget handling.'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Storage
                  </span>
                  <p className="text-xs text-slate-300">
                    {productDetails?.storageInstructions || 'Store in cool dry place away from heat.'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Who Should Avoid
                  </span>
                  <p className="text-xs text-slate-300">
                    {productDetails?.usersWhoShouldAvoid || 'None specified.'}
                  </p>
                </div>
              </div>

              {/* Customer Support Contact */}
              {productDetails?.customerSupportContact && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
                  <span>Brand Support: {productDetails.customerSupportContact.email || productDetails.customerSupportContact.phone}</span>
                  <span className="text-emerald-400">Direct logistics query channel</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DO'S AND DON'TS */}
          {activeTab === 'dos_donts' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header with Progress Tracker */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Review Guidelines & Integrity Standards
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Please review and understand all brand rules. Mandatory items must be checked before submitting.
                    </p>
                  </div>

                  <button
                    onClick={markAllAsRead}
                    className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    Mark All as Read
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Mandatory Instructions Read:</span>
                    <span className={isReadingComplete ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {totalReadCount} / {totalMandatoryCount} ({Math.round(totalMandatoryCount > 0 ? (totalReadCount / totalMandatoryCount) * 100 : 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${totalMandatoryCount > 0 ? (totalReadCount / totalMandatoryCount) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Two Column Layout: DOs vs DONTs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DO COLUMN */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
                    <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Review DO's</h4>
                      <span className="text-[11px] text-slate-400">Best practices for genuine testing</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {dos.map((item, idx) => {
                      const isRead = readDos.includes(item.id);
                      return (
                        <div
                          key={item.id || idx}
                          onClick={() => toggleDoRead(item.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isRead
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isRead ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-900'
                            }`}>
                              {isRead && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between gap-1 flex-wrap">
                                <span className="font-semibold text-xs sm:text-sm text-white">
                                  {item.text}
                                </span>
                                {item.isMandatory && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-medium">
                                    Mandatory
                                  </span>
                                )}
                              </div>

                              {item.description && (
                                <p className="text-xs text-slate-400 leading-normal">
                                  {item.description}
                                </p>
                              )}

                              {item.example && (
                                <div className="text-[11px] text-emerald-400/90 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/10 mt-1">
                                  <span className="font-semibold">Example:</span> {item.example}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DON'T COLUMN */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-500/20">
                    <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wide">Review DON'Ts</h4>
                      <span className="text-[11px] text-slate-400">Prohibited actions & policy bans</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {donts.map((item, idx) => {
                      const isRead = readDonts.includes(item.id);
                      return (
                        <div
                          key={item.id || idx}
                          onClick={() => toggleDontRead(item.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isRead
                              ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isRead ? 'bg-rose-500 border-rose-400 text-slate-950' : 'border-slate-600 bg-slate-900'
                            }`}>
                              {isRead && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between gap-1 flex-wrap">
                                <span className="font-semibold text-xs sm:text-sm text-white">
                                  {item.text}
                                </span>
                                {item.isMandatory && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-medium">
                                    Strict Ban
                                  </span>
                                )}
                              </div>

                              {item.description && (
                                <p className="text-xs text-slate-400 leading-normal">
                                  {item.description}
                                </p>
                              )}

                              {item.example && (
                                <div className="text-[11px] text-rose-400/90 bg-rose-950/40 p-1.5 rounded-lg border border-rose-500/10 mt-1">
                                  <span className="font-semibold">Avoid:</span> {item.example}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEW REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Video Format Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Video Duration</span>
                  <span className="font-bold text-white text-sm sm:text-base mt-1 block">
                    {brief.minDurationSeconds}s – {brief.maxDurationSeconds}s
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Orientation</span>
                  <span className="font-bold text-emerald-400 text-sm sm:text-base mt-1 block uppercase">
                    {brief.videoOrientation === 'vertical' ? '9:16 Vertical' : '16:9 Landscape'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Audio Quality</span>
                  <span className="font-bold text-sky-400 text-sm sm:text-base mt-1 block">
                    Clear Voice Mic
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block">Language</span>
                  <span className="font-bold text-amber-300 text-sm sm:text-base mt-1 block capitalize">
                    {campaign.preferredLanguage === 'bn' ? 'Bangla (বাংলা)' : 'English'}
                  </span>
                </div>
              </div>

              {/* Mandatory Required Shots */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-emerald-400" />
                  Mandatory Video Shots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {brief.requiredShots.map((shot, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <span>{shot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Talking Points */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Mandatory Talking Points to Cover
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {brief.mandatoryTalkingPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Disclosure */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  Mandatory Disclosure Requirement
                </span>
                <p className="text-slate-300 text-xs sm:text-sm">
                  {brief.disclosureRequirement}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: DELIVERY & RETURN */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Outbound Delivery */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Truck className="w-5 h-5" />
                    Courier Dispatch to Your Address
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Brand will dispatch the product via trusted logistics partners (Steadfast / Pathao / RedX) directly to your verified BringDollar profile address within 24-48 hours of acceptance.
                  </p>
                  <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200">Delivery Cost:</span> 100% Free (Covered by Brand).
                  </div>
                </div>

                {/* Return Requirement */}
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Package className="w-5 h-5" />
                    Product Return Policy
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {campaign.isReturnRequired
                      ? 'This is a returnable high-value testing unit. You must repack all original accessories and schedule the free return pickup within 3 days after review submission.'
                      : 'You do not need to return this product. It is provided to you as a gifted testing unit upon verified review completion.'}
                  </p>
                  <div className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200">Return Courier:</span> {campaign.returnShippingCoveredByBrand ? 'Prepaid Label by Brand' : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Delivery Address Reminder */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Deliver to:</span>
                  <span className="font-bold text-white">{reviewerProfile.deliveryAddress.fullAddress}, {reviewerProfile.deliveryAddress.district}</span>
                </div>
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  Recipient: {reviewerProfile.deliveryAddress.recipientName} ({reviewerProfile.deliveryAddress.phone})
                </span>
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT & ESCROW */}
          {activeTab === 'payment' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">Guaranteed Escrow Payout</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      ৳{campaign.reviewerRewardBdt.toLocaleString()} BDT
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Escrow Secured
                  </div>
                  <p>
                    The brand has already deposited the full payout amount into BringDollar escrow. Funds are locked and automatically released to your wallet upon review QA approval.
                  </p>
                </div>
              </div>

              {/* XP and Coin Bonuses */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                  <span className="text-xs text-slate-400">Career XP</span>
                  <div className="text-xl font-bold text-amber-400">+{campaign.careerXpReward} XP</div>
                  <span className="text-[11px] text-slate-500">Boosts reviewer rank & level</span>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                  <span className="text-xs text-slate-400">Reward Coins</span>
                  <div className="text-xl font-bold text-amber-300">+{campaign.rewardCoinsReward} Coins</div>
                  <span className="text-[11px] text-slate-500">Spendable in Rewards Vault</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Acknowledgement & Apply Action */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 space-y-4 shrink-0">
          {!readOnly && !isApplied && !hasAssignment && (
            <div className="space-y-3">
              {/* Acknowledgement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={isTermsAcknowledged}
                  onChange={(e) => setIsTermsAcknowledged(e.target.checked)}
                  disabled={!hasViewedProductDetails || !hasViewedDosAndDonts || !isReadingComplete}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 transition cursor-pointer disabled:opacity-40"
                />
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-tight block group-hover:text-white">
                    I have read and understood the Product Details, Review Do’s and Don’ts, testing requirements, content requirements, payment terms and return policy.
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Version: {brief.briefVersion || 'v1.0'} • Logged with Reviewer ID: {reviewerProfile.reviewerId || 'BD-REV-84920'}
                  </span>
                </div>
              </label>

              {/* Pre-validation warnings if button is disabled */}
              {(!hasViewedProductDetails || !hasViewedDosAndDonts || !isReadingComplete) && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {!hasViewedProductDetails && '👉 View "Product Details" tab • '}
                    {!hasViewedDosAndDonts && '👉 View "Do’s and Don’ts" tab • '}
                    {!isReadingComplete && `👉 Read all ${totalMandatoryCount} mandatory instructions (${totalReadCount}/${totalMandatoryCount})`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            {readOnly || isApplied || hasAssignment ? (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Task Accepted & In Progress
              </div>
            ) : (
              <button
                onClick={() => onApply(campaign.id)}
                disabled={!canApply}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
                  canApply
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                }`}
              >
                <span>Accept Task & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
