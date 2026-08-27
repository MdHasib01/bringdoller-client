import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, Assignment, CampaignDoItem, CampaignDontItem, ProductDetails } from '../../types';
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  RotateCcw,
  Sparkles,
  Video,
  Send,
  Eye,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Check,
  Trash2,
  Layers,
  FileText,
  ExternalLink,
  Smartphone,
  HelpCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import { formatBdt, toBengaliDigits } from '../../utils/formatters';
import { StatusChip } from '../common/StatusChip';
import { CampaignDetailModal } from '../common/CampaignDetailModal';

export const BrandDashboard: React.FC = () => {
  const {
    brandProfile,
    campaigns,
    assignments,
    createCampaign,
    approveReviewAndReleasePayout,
    requestRevision,
    language,
    addToast,
    activeStore,
    activeStoreId,
    stores,
    deliveries,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'submissions' | 'builder' | 'ambassadors'>('campaigns');

  // Basic Campaign Form States
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('স্মার্ট গ্যাজেটস');
  const [productValue, setProductValue] = useState(3500);
  const [reviewerReward, setReviewerReward] = useState(1500);
  const [testingDays, setTestingDays] = useState(5);
  const [totalSlots, setTotalSlots] = useState(10);
  const [objective, setObjective] = useState('প্রোডাক্টের দীর্ঘমেয়াদী বাস্তব ব্যবহার, বিল্ড কোয়ালিটি ও নিরপেক্ষ সীমাবদ্ধতা মূল্যায়ন।');
  const [isReturnReq, setIsReturnReq] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');

  // Rich Product Details States
  const [productPurpose, setProductPurpose] = useState('দৈনন্দিন জীবন ও আউটডোর ব্যবহারে টেকসই গ্যাজেটের পারফরম্যান্স টেস্ট।');
  const [productSpecs, setProductSpecs] = useState('ব্লুটুথ ৫.৩, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC), ৪০ ঘণ্টা ব্যাটারি লাইফ।');
  const [productSize, setProductSize] = useState('ফুল সাইজ ওভার-ইয়ার হেডফোন (320g)');
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com/product');
  const [safetyNotes, setSafetyNotes] = useState('অতিরিক্ত ভলিউমে দীর্ঘসময় শোনা থেকে বিরত থাকুন। পানিতে ভেজাবেন না।');
  const [storageNotes, setStorageNotes] = useState('শুষ্ক স্থানে রাখুন এবং মূল ক্যারি পাউচে সংরক্ষণ করুন।');
  const [intendedUsers, setIntendedUsers] = useState('সঙ্গীতপ্রেমী, পডকাস্টার, ভ্রমণকারী ও ফ্রিল্যান্সার');
  const [usersToAvoid, setUsersToAvoid] = useState('সুইমিং বা ভারী বৃষ্টির সময় ব্যবহারকারী');
  const [keyFeaturesList, setKeyFeaturesList] = useState<string[]>([
    '40mm নিওডাইমিয়াম ডাইনামিক ড্রাইভার্স',
    '3-মাইক্রোফোন এনভায়রনমেন্টাল নয়েজ ক্যান্সেলেশন',
    'ফাস্ট টাইপ-সি চার্জিং (১০ মিনিটে ৫ ঘণ্টা প্লেব্যাক)',
  ]);
  const [newKeyFeature, setNewKeyFeature] = useState('');

  const [usageStepsList, setUsageStepsList] = useState<string[]>([
    'হেডফোনটি আনবক্স করে প্রথমবার ১০০% চার্জ দিন।',
    'স্মার্টফোনের ব্লুটুথ অন করে পেয়ারিং সম্পন্ন করুন।',
    'টানা ৫ দিন ইনডোর ও আউটডোর উভয় পরিবেশে গান ও কলিং সাউন্ড টেস্ট করুন।',
  ]);
  const [newUsageStep, setNewUsageStep] = useState('');

  // Review DOs and DONTs Builder States
  const [dosList, setDosList] = useState<CampaignDoItem[]>([
    {
      id: 'do-custom-1',
      text: 'প্রাকৃতিক আলোতে পরিষ্কার আনবক্সিং এবং সব সামগ্রীর ক্লোজ শট নিন',
      description: 'বক্সের ভেতর থাকা ক্যাবল ও ওয়ারেন্টি কার্ড স্পষ্ট দেখান।',
      example: 'দিনের আলোতে টেবিলের ওপর পণ্যটি ঘুরিয়ে দেখান।',
      isMandatory: true,
    },
    {
      id: 'do-custom-2',
      text: 'টানা ৫ দিন বাস্তব ব্যবহারের পর সুবিধা ও কমপক্ষে ১টি সীমাবদ্ধতা উল্লেখ করুন',
      description: 'অতিরিক্ত প্রশংসা পরিহার করে আসল অভিজ্ঞতা জানান।',
      example: '"সাউন্ড ভালো তবে ভারী হওয়ায় ৩ ঘণ্টা পর কিছুটা অস্বস্তি লাগে"',
      isMandatory: true,
    },
  ]);

  const [dontsList, setDontsList] = useState<CampaignDontItem[]>([
    {
      id: 'dont-custom-1',
      text: 'কোনো অবাস্তব বা শতভাগ ত্রুটিহীন পণ্য বলে মিথ্যা দাবি করবেন না',
      description: 'BringDollar এর নিরপেক্ষ নীতি অনুযায়ী কৃত্রিম প্রমোশন নিষিদ্ধ।',
      example: '"বিশ্বের সেরা ও কোনো সমস্যা নেই" এমন বাক্য বলা নিষিদ্ধ।',
      isMandatory: true,
    },
    {
      id: 'dont-custom-2',
      text: 'অস্পষ্ট বা কম আলোতে ভিডিও রেকর্ড করবেন না',
      description: 'শব্দে অতিরিক্ত নয়েজ বা প্রতিধ্বনি থাকা যাবে না।',
      example: 'বাতাস বা গাড়ির হর্নের শব্দে কথা বলা পরিহার করুন।',
      isMandatory: true,
    },
  ]);

  const [newDoText, setNewDoText] = useState('');
  const [newDoExample, setNewDoExample] = useState('');
  const [newDoMandatory, setNewDoMandatory] = useState(true);

  const [newDontText, setNewDontText] = useState('');
  const [newDontExample, setNewDontExample] = useState('');
  const [newDontMandatory, setNewDontMandatory] = useState(true);

  // Preview Modal
  const [previewCampaignData, setPreviewCampaignData] = useState<Campaign | null>(null);

  // Revision Modal
  const [revisionModalTask, setRevisionModalTask] = useState<Assignment | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  const brandCampaigns = campaigns.filter(
    (c) => c.brandId === activeStoreId || c.storeId === activeStoreId || c.brandId === brandProfile.id
  );
  const brandSubmissions = assignments.filter(
    (a) => a.brandId === activeStoreId || a.storeId === activeStoreId || a.brandId === brandProfile.id
  );

  // Apply Preset Templates
  const handleApplyPreset = (preset: 'tech' | 'skincare' | 'lifestyle') => {
    if (preset === 'tech') {
      setCategory('স্মার্ট গ্যাজেটস');
      setDosList([
        {
          id: `do-${Date.now()}-1`,
          text: 'ডিসপ্লের উজ্জ্বলতা এবং সূর্যের আলোতে দৃশ্যমানতা পরীক্ষা করুন',
          description: 'দিনের কড়া রোদে স্ক্রিনের রিডিবিলিটি ভিডিওতে স্পষ্টভাবে তুলে ধরুন।',
          example: 'বাইরে দাঁড়িয়ে নোটিফিকেশন পড়ার লাইভ শট।',
          isMandatory: true,
        },
        {
          id: `do-${Date.now()}-2`,
          text: 'কলিং টেস্টে মাইকের আওয়াজ ও স্পিকারের স্পষ্টতা যাচাই করুন',
          description: 'লাইভ কল করে অপর প্রান্তের কথা কতটা পরিষ্কার শোনা যায় তা বলুন।',
          example: 'ভিডিও চলাকালে একজনকে কল করে মাইক টেস্ট।',
          isMandatory: true,
        },
        {
          id: `do-${Date.now()}-3`,
          text: 'ব্যাটারি ড্রেন ও চার্জিং টাইমের বাস্তব পরিসংখ্যান উল্লেখ করুন',
          description: 'টানা ব্যবহারে কত ঘণ্টা ব্যাকআপ পান তা জানান।',
          example: '"১০০% চার্জ হতে ১ ঘণ্টা ৪৫ মিনিট সময় লেগেছে"',
          isMandatory: false,
        },
      ]);
      setDontsList([
        {
          id: `dont-${Date.now()}-1`,
          text: 'অন্য কোনো ব্র্যান্ডের পণ্যের নাম উল্লেখ বা সরাসরি তুলনা করবেন না',
          description: 'প্রতিযোগী কোম্পানির নাম বিকৃত করা নিষিদ্ধ।',
          example: 'অমুক ব্র্যান্ডের চেয়ে ভালো বা খারাপ বলা যাবে না।',
          isMandatory: true,
        },
        {
          id: `dont-${Date.now()}-2`,
          text: 'অফিসিয়াল স্পেক্স শিট সরাসরি দেখে মুখস্থ পড়ার মতো বলবেন না',
          description: 'নিজের ভাষায় বাস্তব ব্যবহারের অভিজ্ঞতা জানান।',
          example: 'বক্সের পেছনের লেখা হুবহু রিডিং পড়া যাবে না।',
          isMandatory: true,
        },
      ]);
    } else if (preset === 'skincare') {
      setCategory('স্কিনকেয়ার ও আতর');
      setDosList([
        {
          id: `do-${Date.now()}-1`,
          text: 'হাতে বা ত্বকে লাগানোর পর টেক্সচার ও আঠালো ভাব পরীক্ষা করুন',
          description: 'সিরাম বা আতরের শোষণ ক্ষমতা এবং স্কিন ফিল কেমন তা দেখান।',
          example: 'হাতের তালুতে ২ ফোঁটা নিয়ে আলতো ম্যাসাজ করার ক্লোজ শট।',
          isMandatory: true,
        },
        {
          id: `do-${Date.now()}-2`,
          text: 'সুবাসের স্থায়ীত্ব (লঞ্জিভিটি) ও নোট পরিবর্তন রেকর্ড করুন',
          description: 'প্রথম ঘণ্টা বনাম ৪ ঘণ্টা পরের সুবাসের তারতম্য জানান।',
          example: '"প্রথম ৩০ মিনিট তীব্র হলেও পরে মিষ্টি উডি সুবাস থাকে"',
          isMandatory: true,
        },
      ]);
      setDontsList([
        {
          id: `dont-${Date.now()}-1`,
          text: 'যেকোনো রোগ নিরাময় বা জাদুকরী ত্বকের পরিবর্তনের দাবি নিষিদ্ধ',
          description: 'মেডিকেল বা অবৈজ্ঞানিক মিথ্যা আশ্বাস দেওয়া যাবে না।',
          example: '"১ দিনে ফর্সা" বা "সব ব্রণ চিরতরে দূর" জাতীয় বাক্য নিষিদ্ধ।',
          isMandatory: true,
        },
        {
          id: `dont-${Date.now()}-2`,
          text: 'প্যাচ টেস্ট না করে সরাসরি সংবেদনশীল মুখে লাগাবেন না',
          description: 'ব্যবহার নির্দেশিকার নিরাপত্তা নীতি বজায় রাখুন।',
          example: 'কানে বা কব্জিতে আগে সামান্য টেস্ট করুন।',
          isMandatory: true,
        },
      ]);
    }
    addToast('Preset Applied', 'Campaign requirements and guidelines loaded.', 'info');
  };

  const handleAddKeyFeature = () => {
    if (!newKeyFeature.trim()) return;
    setKeyFeaturesList([...keyFeaturesList, newKeyFeature.trim()]);
    setNewKeyFeature('');
  };

  const handleAddUsageStep = () => {
    if (!newUsageStep.trim()) return;
    setUsageStepsList([...usageStepsList, newUsageStep.trim()]);
    setNewUsageStep('');
  };

  const handleAddDoItem = () => {
    if (!newDoText.trim()) return;
    setDosList([
      ...dosList,
      {
        id: `do-${Date.now()}`,
        text: newDoText.trim(),
        description: 'Brand-defined mandatory guidance for genuine reviewer testing.',
        example: newDoExample.trim() || undefined,
        isMandatory: newDoMandatory,
      },
    ]);
    setNewDoText('');
    setNewDoExample('');
  };

  const handleAddDontItem = () => {
    if (!newDontText.trim()) return;
    setDontsList([
      ...dontsList,
      {
        id: `dont-${Date.now()}`,
        text: newDontText.trim(),
        description: 'Strictly prohibited reviewer action under BringDollar compliance.',
        example: newDontExample.trim() || undefined,
        isMandatory: newDontMandatory,
      },
    ]);
    setNewDontText('');
    setNewDontExample('');
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      addToast('Error', 'Please enter a product name.', 'error');
      return;
    }

    createCampaign({
      brandId: activeStore?.id || brandProfile.id,
      brandName: activeStore?.name || brandProfile.brandName,
      brandLogoUrl: activeStore?.logoUrl || brandProfile.brandLogoUrl,
      storeId: activeStore?.id || 'store-1',
      ownerId: activeStore?.ownerId || 'owner-1',
      productName,
      productImageUrl,
      productValueBdt: productValue,
      category,
      campaignObjective: objective,
      mandatoryTalkingPoints: [
        'প্রোডাক্ট আনবক্সিং ও প্রথম অভিজ্ঞতা',
        'টানা ৫ দিনের বাস্তব ব্যবহারের সুনির্দিষ্ট সুবিধা',
        'অন্তত ১টি গঠনমূলক সীমাবদ্ধতা বা পরামর্শ',
      ],
      optionalTalkingPoints: ['বক্সে থাকা এক্সেসরিজ কোয়ালিটি', 'মূল্য অনুযায়ী উপযোগিতা'],
      prohibitedClaims: ['অন্য ব্র্যান্ডের সাথে অসঙ্গত তুলনা', 'মিথ্যা বা অতিরঞ্জিত ফলাফল'],
      requiredVisualShots: ['আনবক্সিং ক্লোজ শট', 'বাস্তব ব্যবহার ও লাইভ টেস্টিং শট', 'ক্যামেরায় কথা বলার ক্লিয়ার ফ্রেম'],
      videoOrientation: 'vertical_9_16',
      durationRangeSeconds: { min: 60, max: 180 },
      testingDurationDays: testingDays,
      totalSlots: totalSlots,
      slotsRemaining: totalSlots,
      reviewerRewardBdt: reviewerReward,
      careerXpReward: Math.round(reviewerReward * 0.4),
      rewardCoinsReward: Math.round(reviewerReward * 0.25),
      isReturnRequired: isReturnReq,
      status: 'active',
      
      // Enriched Product Details & Guidelines
      brief: {
        objective,
        minDurationSeconds: 60,
        maxDurationSeconds: 180,
        videoOrientation: 'vertical',
        requiredShots: ['আনবক্সিং ক্লোজ শট', 'বাস্তব ব্যবহার ও লাইভ টেস্টিং শট'],
        mandatoryTalkingPoints: ['বাস্তব ব্যবহার', 'সুবিধা ও ১টি সীমাবদ্ধতা'],
        optionalTalkingPoints: ['বক্স এক্সেসরিজ'],
        prohibitedClaims: ['কাল্পনিক দাবি বা মিথ্যা প্রশংসা'],
        disclosureRequirement: 'This video is a verified BringDollar unbiased consumer test.',
        honestReviewGuidelinesBn: 'প্ল্যাটফর্মের নিয়ম অনুযায়ী পণ্যের সুবিধা এবং অন্তত ১টি বাস্তব সীমাবদ্ধতা উল্লেখ করা বাধ্যতামূলক।',
        honestReviewGuidelinesEn: 'You are required to highlight genuine advantages and at least one real limitation.',
        testingDurationDays: testingDays,
        briefVersion: 'v1.0',
        lastUpdated: new Date().toISOString(),
        productDetails: {
          productName,
          description: objective,
          purpose: productPurpose,
          specifications: productSpecs,
          keyFeatures: keyFeaturesList,
          sizeOrQuantity: productSize,
          usageInstructions: usageStepsList,
          safetyInstructions: safetyNotes,
          storageInstructions: storageNotes,
          intendedUsers: intendedUsers,
          usersWhoShouldAvoid: usersToAvoid,
          websiteUrl: websiteUrl,
          priceBdt: productValue,
          images: [productImageUrl],
        },
        dos: dosList,
        donts: dontsList,
      },
    });

    addToast('Campaign Created', 'Your campaign has been funded in escrow and published.', 'success');
    setActiveTab('campaigns');
    setProductName('');
  };

  const handleOpenPreview = () => {
    const mockCampaign: Campaign = {
      id: 'preview-camp-1',
      title: `${productName || 'Sample Product'}: ${testingDays} দিনের বাস্তব অভিজ্ঞতা ও কোয়ালিটি রিভিউ`,
      brandId: brandProfile.id,
      brandName: brandProfile.brandName,
      brandLogoUrl: brandProfile.brandLogoUrl,
      productId: 'preview-prod-1',
      status: 'active',
      category,
      productName: productName || 'প্রিমিয়াম টেস্ট প্রোডাক্ট',
      productImageUrl,
      productRetailPriceBdt: productValue,
      reviewerRewardBdt: reviewerReward,
      careerXpReward: Math.round(reviewerReward * 0.4),
      rewardCoinsReward: Math.round(reviewerReward * 0.25),
      totalReviewersTarget: totalSlots,
      reviewersHired: 0,
      submissionsApproved: 0,
      minReviewerLevel: 'pro',
      minTrustScore: 85,
      isReturnRequired: isReturnReq,
      returnShippingCoveredByBrand: true,
      preferredLanguage: 'bn',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      applicationDeadline: new Date(Date.now() + 86400000 * 7).toISOString(),
      createdAt: new Date().toISOString(),
      budget: {
        reviewerPayoutTotalBdt: reviewerReward * totalSlots,
        platformFeeBdt: Math.round(reviewerReward * totalSlots * 0.15),
        logisticsFeeBdt: 1200,
        taxBdt: 0,
        grandTotalBdt: Math.round(reviewerReward * totalSlots * 1.15) + 1200,
        escrowFunded: true,
      },
      brief: {
        objective,
        minDurationSeconds: 60,
        maxDurationSeconds: 180,
        videoOrientation: 'vertical',
        requiredShots: ['আনবক্সিং ক্লোজ শট', 'বাস্তব ব্যবহার ও লাইভ টেস্টিং শট'],
        mandatoryTalkingPoints: ['বাস্তব ব্যবহার', 'সুবিধা ও ১টি সীমাবদ্ধতা'],
        optionalTalkingPoints: ['বক্স এক্সেসরিজ'],
        prohibitedClaims: ['কাল্পনিক দাবি বা মিথ্যা প্রশংসা'],
        disclosureRequirement: 'This video is a verified BringDollar unbiased consumer test.',
        honestReviewGuidelinesBn: 'প্ল্যাটফর্মের নিয়ম অনুযায়ী পণ্যের সুবিধা এবং অন্তত ১টি বাস্তব সীমাবদ্ধতা উল্লেখ করা বাধ্যতামূলক।',
        honestReviewGuidelinesEn: 'You are required to highlight genuine advantages and at least one real limitation.',
        testingDurationDays: testingDays,
        briefVersion: 'v1.0',
        productDetails: {
          productName: productName || 'প্রিমিয়াম টেস্ট প্রোডাক্ট',
          description: objective,
          purpose: productPurpose,
          specifications: productSpecs,
          keyFeatures: keyFeaturesList,
          sizeOrQuantity: productSize,
          usageInstructions: usageStepsList,
          safetyInstructions: safetyNotes,
          storageInstructions: storageNotes,
          intendedUsers: intendedUsers,
          usersWhoShouldAvoid: usersToAvoid,
          websiteUrl: websiteUrl,
          priceBdt: productValue,
          images: [productImageUrl],
        },
        dos: dosList,
        donts: dontsList,
      },
    };
    setPreviewCampaignData(mockCampaign);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 space-y-8 text-slate-100">
      {/* Brand & Store Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={activeStore?.logoUrl || brandProfile.brandLogoUrl}
            alt={activeStore?.name || brandProfile.brandName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-slate-950 p-1 ring-2 ring-amber-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{activeStore?.name || brandProfile.brandName}</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  activeStore?.verificationStatus === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {activeStore?.verificationStatus === 'approved' ? '✓ Approved Merchant' : 'Under Admin Review'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Owner: <span className="text-emerald-400 font-semibold">{activeStore?.ownerName || brandProfile.companyName}</span> • Trade License: <span className="font-mono text-white/60">{activeStore?.tradeLicenseNumber || 'TRAD/DSCC/0192837'}</span> • Escrow Balance: <span className="font-mono text-emerald-400 font-bold">{formatBdt(activeStore?.escrowBalanceBdt || 150000, language)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'campaigns'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Campaigns ({brandCampaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Review Submissions ({brandSubmissions.length})
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'builder'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Campaign & Guidelines Builder
        </button>

        <button
          onClick={() => setActiveTab('ambassadors')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'ambassadors'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Brand Ambassadors
        </button>
      </div>

      {/* TAB: CAMPAIGNS LIST */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandCampaigns.map((camp) => (
              <div key={camp.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <img
                      src={camp.productImageUrl}
                      alt={camp.productName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                    />
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
                        Brief {camp.brief?.briefVersion || 'v1.0'}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold text-sm block mt-1">
                        ৳{camp.reviewerRewardBdt.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">{camp.category}</span>
                    <h3 className="text-sm font-bold text-white leading-snug mt-0.5">{camp.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Slots Hired:</span>
                      <span className="text-white font-bold">{camp.reviewersHired} / {camp.totalReviewersTarget}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Testing Days:</span>
                      <span className="text-sky-400 font-bold">{camp.brief?.testingDurationDays || 4} Days</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Escrow: <strong className="text-emerald-400">Secured</strong></span>
                  <button
                    onClick={() => {
                      setPreviewCampaignData(camp);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View 6-Tab Brief</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {brandSubmissions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-sm">
              No reviewer submissions pending review at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {brandSubmissions.map((sub) => (
                <div key={sub.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.productImageUrl}
                        alt={sub.productName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{sub.productName}</h4>
                          <StatusChip status={sub.status} lang={language} size="sm" />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Reviewer: <strong className="text-white">{sub.reviewerName}</strong> • Payout: <strong className="text-emerald-400 font-mono">৳{sub.payoutBdt} BDT</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          approveReviewAndReleasePayout(sub.id);
                          addToast('Approved', 'Review approved and escrow payout released.', 'success');
                        }}
                        disabled={sub.status === 'approved'}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Release Funds</span>
                      </button>

                      {sub.status !== 'approved' && (
                        <button
                          onClick={() => setRevisionModalTask(sub)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CAMPAIGN & GUIDELINES BUILDER */}
      {activeTab === 'builder' && (
        <form onSubmit={handleCreateCampaignSubmit} className="space-y-6">
          
          {/* Top Presets & Overview */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Campaign & Brief Creator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define comprehensive product details, review Do's & Don'ts, and escrow parameters.
                </p>
              </div>

              {/* Quick Template Presets */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Load Preset:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('tech')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-sky-300 border border-slate-700 hover:bg-slate-700"
                >
                  📱 Tech & Gadgets
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('skincare')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
                >
                  🌿 Fragrance & Care
                </button>
              </div>
            </div>

            {/* Campaign Core Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Pulse Pro ANC Studio Headphones"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="স্মার্ট গ্যাজেটস">স্মার্ট গ্যাজেটস (Tech & Gadgets)</option>
                  <option value="পারফিউম ও আতর">পারফিউম ও আতর (Fragrance)</option>
                  <option value="স্কিনকেয়ার">স্কিনকেয়ার (Skincare & Beauty)</option>
                  <option value="লাইফস্টাইল">লাইফস্টাইল (Fashion & Lifestyle)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Retail Price (BDT)</label>
                <input
                  type="number"
                  value={productValue}
                  onChange={(e) => setProductValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reviewer Payout Reward (BDT)</label>
                <input
                  type="number"
                  value={reviewerReward}
                  onChange={(e) => setReviewerReward(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-bold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Testing Duration (Days)</label>
                <input
                  type="number"
                  value={testingDays}
                  onChange={(e) => setTestingDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Reviewer Slots</label>
                <input
                  type="number"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Return Policy</label>
                <select
                  value={isReturnReq ? 'true' : 'false'}
                  onChange={(e) => setIsReturnReq(e.target.value === 'true')}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="false">Gifted (Reviewer keeps the product)</option>
                  <option value="true">Return Required (High value test unit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-xs">Primary Product Image URL</label>
              <input
                type="text"
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Mandatory "Product Details" Builder */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Package className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">
                Mandatory Product Details Section
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Purpose & Usage Intent</label>
                <textarea
                  rows={2}
                  value={productPurpose}
                  onChange={(e) => setProductPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specifications & Pack Size</label>
                <textarea
                  rows={2}
                  value={productSpecs}
                  onChange={(e) => setProductSpecs(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Key Features List Builder */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Key Features to Test</label>
              <div className="space-y-1.5">
                {keyFeaturesList.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-200">• {feat}</span>
                    <button
                      type="button"
                      onClick={() => setKeyFeaturesList(keyFeaturesList.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a key feature to test..."
                  value={newKeyFeature}
                  onChange={(e) => setNewKeyFeature(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddKeyFeature}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Step-by-Step Usage Instructions */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Step-by-Step Testing Guidelines</label>
              <div className="space-y-1.5">
                {usageStepsList.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-200">{idx + 1}. {step}</span>
                    <button
                      type="button"
                      onClick={() => setUsageStepsList(usageStepsList.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a step-by-step guideline..."
                  value={newUsageStep}
                  onChange={(e) => setNewUsageStep(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddUsageStep}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  + Add Step
                </button>
              </div>
            </div>

            {/* Safety & Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Safety & Precautions</label>
                <input
                  type="text"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Storage Instructions</label>
                <input
                  type="text"
                  value={storageNotes}
                  onChange={(e) => setStorageNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Mandatory "Review Do's and Don'ts" Builder */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Mandatory Review Do's & Don'ts Builder
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {dosList.length} DOs • {dontsList.length} DON'Ts
              </span>
            </div>

            {/* Two Column Layout: DOs vs DONTs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DO COLUMN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review DO's</span>
                </div>

                <div className="space-y-2">
                  {dosList.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-slate-950 border border-emerald-500/20 rounded-xl space-y-1 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white">{item.text}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.isMandatory && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded">
                              Mandatory
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setDosList(dosList.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {item.example && (
                        <p className="text-[11px] text-slate-400">Example: {item.example}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New DO */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="New DO rule (e.g., Show unboxing close-up)..."
                    value={newDoText}
                    onChange={(e) => setNewDoText(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Optional example or guidance note..."
                    value={newDoExample}
                    onChange={(e) => setNewDoExample(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDoMandatory}
                        onChange={(e) => setNewDoMandatory(e.target.checked)}
                        className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                      />
                      <span>Mandatory Requirement</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddDoItem}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400"
                    >
                      + Add DO
                    </button>
                  </div>
                </div>
              </div>

              {/* DONT COLUMN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Review DON'Ts</span>
                </div>

                <div className="space-y-2">
                  {dontsList.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-slate-950 border border-rose-500/20 rounded-xl space-y-1 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white">{item.text}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.isMandatory && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/10 text-rose-400 rounded">
                              Strict Ban
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setDontsList(dontsList.filter((_, i) => i !== idx))}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {item.example && (
                        <p className="text-[11px] text-slate-400">Avoid: {item.example}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New DONT */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="New DON'T rule (e.g., No exaggerated miracle claims)..."
                    value={newDontText}
                    onChange={(e) => setNewDontText(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Optional prohibited example..."
                    value={newDontExample}
                    onChange={(e) => setNewDontExample(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDontMandatory}
                        onChange={(e) => setNewDontMandatory(e.target.checked)}
                        className="rounded text-rose-500 bg-slate-900 border-slate-700"
                      />
                      <span>Strict Ban</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddDontItem}
                      className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500"
                    >
                      + Add DON'T
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview 6-Tab Reviewer Modal</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Campaign & Fund Escrow</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: AMBASSADORS */}
      {activeTab === 'ambassadors' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Brand Ambassador Retainers
              </h3>
              <p className="text-xs text-slate-400">
                Contract top verified creators for exclusive monthly retainers (up to ৳100,000/mo).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            👑 Tanvir Ahmed (Level 4 Pro Reviewer) is currently active as Brand Ambassador with 94% Trust Score.
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">
                  Request Review Revision
                </h3>
              </div>
              <button
                onClick={() => setRevisionModalTask(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400">
              State specific factual issues or missing production shots in accordance with the campaign brief.
            </p>

            <textarea
              rows={4}
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-rose-500 focus:outline-none"
              placeholder="e.g., Please add a 3-second outdoor sunlight shot as specified in Do's and Don'ts..."
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevisionModalTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!revisionFeedback.trim()) return;
                  requestRevision(revisionModalTask.id, revisionFeedback);
                  setRevisionModalTask(null);
                  setRevisionFeedback('');
                  addToast('Revision Requested', 'Feedback sent to reviewer.', 'info');
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviewer Preview Modal */}
      {previewCampaignData && (
        <CampaignDetailModal
          campaign={previewCampaignData}
          isOpen={Boolean(previewCampaignData)}
          onClose={() => setPreviewCampaignData(null)}
          onApply={() => {
            setPreviewCampaignData(null);
            addToast('Preview Mode', 'This was a preview simulation of the Reviewer view.', 'info');
          }}
          readOnly={false}
        />
      )}
    </div>
  );
};
