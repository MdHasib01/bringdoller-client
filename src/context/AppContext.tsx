import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { api, syncToServer } from '../api/client';
import {
  UserRole,
  Language,
  ReviewerProfile,
  BrandProfile,
  Product,
  Campaign,
  Assignment,
  RewardItem,
  RewardRedemption,
  LeaderboardEntry,
  WalletTransaction,
  WithdrawalRequest,
  BrandAmbassadorContract,
  Dispute,
  RiskFlag,
  NotificationItem,
  AutomationRule,
  TrainingModule,
  AuditLog,
  AssignmentStatus,
  QualityRating,
  BusinessOwner,
  Store,
  Delivery,
  ReturnBooking,
  ReviewerAccountStatus,
  DeliveryStatus,
  ReturnStatus,
} from '../types';
import {
  INITIAL_REVIEWER_PROFILE,
  INITIAL_BRAND_PROFILE,
  SEED_PRODUCTS,
  SEED_CAMPAIGNS,
  INITIAL_ASSIGNMENTS,
  SEED_REWARDS,
  SEED_LEADERBOARD,
  SEED_TRANSACTIONS,
  SEED_WITHDRAWALS,
  SEED_AMBASSADOR_CONTRACTS,
  SEED_DISPUTES,
  SEED_RISK_FLAGS,
  SEED_AUTOMATIONS,
  SEED_NOTIFICATIONS,
  SEED_TRAINING_MODULES,
  SEED_AUDIT_LOGS,
  SEED_BUSINESS_OWNERS,
  SEED_STORES,
  SEED_DELIVERIES,
  SEED_RETURN_BOOKINGS,
  SEED_REVIEWER_DIRECTORY_LIST,
} from '../data/seedData';
import { getLevelByXp } from '../utils/levels';
import { generateTrackingId, getNextDeliveryStatus, getNextReturnStatus, COURIER_PROVIDERS } from '../utils/courierAdapter';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Global & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  
  // Navigation
  activeReviewerTab: string;
  setActiveReviewerTab: (tab: string) => void;
  activeBrandTab: string;
  setActiveBrandTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  
  // Toast & Confetti
  toasts: Toast[];
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  
  // Reviewer State & Handlers
  reviewerProfile: ReviewerProfile;
  updateReviewerProfile: (updates: Partial<ReviewerProfile>) => void;
  submitOnboardingStep: (step: number, data: Partial<ReviewerProfile>) => void;
  submitDemoReview: (videoUrl: string, notes: string) => void;
  
  // Brand & Multi-Store State & Handlers
  brandProfile: BrandProfile;
  updateBrandProfile: (updates: Partial<BrandProfile>) => void;
  stores: Store[];
  activeStoreId: string;
  setActiveStoreId: (storeId: string) => void;
  activeStore?: Store;
  businessOwners: BusinessOwner[];
  addStore: (storeData: Partial<Store>) => Store;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  adminApproveStore: (storeId: string) => void;
  adminRequestStoreChanges: (storeId: string, note: string) => void;
  adminSuspendStore: (storeId: string, reason: string) => void;

  // Logistics & Delivery State & Handlers
  deliveries: Delivery[];
  returnBookings: ReturnBooking[];
  createDeliveryShipment: (deliveryData: Partial<Delivery>) => Delivery;
  advanceDeliverySimulationStep: (deliveryId: string) => void;
  advanceReturnSimulationStep: (returnId: string) => void;
  confirmReturnInspection: (returnId: string, isSatisfactory: boolean, brandNotes?: string) => void;

  // Reviewer Directory & Admin Reviewer Handlers
  reviewerDirectoryList: ReviewerProfile[];
  adminVerifyReviewerNid: (reviewerId: string, approve: boolean, notes?: string) => void;
  adminUpdateReviewerStatus: (reviewerId: string, status: ReviewerAccountStatus, note?: string) => void;
  adminAdjustTrustScore: (reviewerId: string, delta: number, reason: string) => void;
  adminToggleAmbassadorStatus: (reviewerId: string) => void;

  // Product Catalog & Approval
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  adminApproveProduct: (productId: string) => void;
  adminRequestProductChanges: (productId: string, note: string) => void;
  
  // Campaign & Assignment
  campaigns: Campaign[];
  addCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'reviewersHired' | 'submissionsApproved'>) => Campaign;
  assignments: Assignment[];
  applyToCampaign: (campaignId: string) => void;
  confirmProductReceipt: (assignmentId: string) => void;
  reportDamagedProduct: (assignmentId: string, reason: string) => void;
  startProductTesting: (assignmentId: string) => void;
  submitAssignmentReview: (assignmentId: string, videoUrl: string, summary: string, pros: string[], cons: string[], rating: number, notes?: string) => void;
  requestAssignmentRevision: (assignmentId: string, reasonCategory: 'factual_error' | 'missing_mandatory_shot' | 'audio_video_quality' | 'policy_violation', details: string, timestampMarkers?: string[]) => void;
  approveAssignmentSubmission: (assignmentId: string, ratingBreakdown?: QualityRating['scores'], publicNotes?: string) => void;
  confirmReturnShipped: (assignmentId: string, courierName: string, trackingId: string) => void;
  confirmReturnReceived: (assignmentId: string) => void;
  
  // Rewards & Wallet
  rewards: RewardItem[];
  redemptions: RewardRedemption[];
  redeemReward: (rewardId: string, shippingAddress: string, phone: string) => boolean;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (amount: number, method: 'bkash' | 'nagad' | 'bank', accountNumber: string, bankDetails?: any) => boolean;
  
  // Ambassador & Disputes
  ambassadorContracts: BrandAmbassadorContract[];
  disputes: Dispute[];
  createDispute: (assignmentId: string, reason: Dispute['reason'], description: string, evidenceUrls?: string[]) => void;
  addDisputeMessage: (disputeId: string, message: string) => void;
  resolveDispute: (disputeId: string, resolutionSummary: string, fundsAction: 'release_to_reviewer' | 'refund_to_brand' | 'split_payout', reviewerAmount?: number, brandRefundAmount?: number) => void;
  
  // Admin Operations
  riskFlags: RiskFlag[];
  resolveRiskFlag: (flagId: string, action: 'dismissed' | 'warning_issued' | 'restricted', note: string) => void;
  automations: AutomationRule[];
  toggleAutomationRule: (ruleId: string) => void;
  triggerAutomationTest: (ruleId: string) => void;
  auditLogs: AuditLog[];
  adminApproveReviewer: (reviewerId: string, approve: boolean, notes?: string) => void;
  adminRateDemoVideo: (reviewerId: string, scores: NonNullable<ReviewerProfile['demoSubmission']>['rubricScores'], feedback: string, approve: boolean) => void;
  adminApproveBrand: (brandId: string, approve: boolean) => void;
  adminApproveCampaign: (campaignId: string) => void;
  adminProcessWithdrawal: (withdrawalId: string, approve: boolean, trxId?: string) => void;
  
  // Leaderboard & Training
  leaderboard: LeaderboardEntry[];
  trainingModules: TrainingModule[];
  completeTrainingModule: (moduleId: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('reviewer'); // Default to rich Reviewer experience, switchable anytime
  const [language, setLanguage] = useState<Language>('en');
  
  // Navigation active tabs
  const [activeReviewerTab, setActiveReviewerTab] = useState<string>('home');
  const [activeBrandTab, setActiveBrandTab] = useState<string>('dashboard');
  const [activeAdminTab, setActiveAdminTab] = useState<string>('command_center');
  
  // Core App Entities
  const [reviewerProfile, setReviewerProfile] = useState<ReviewerProfile>(INITIAL_REVIEWER_PROFILE);
  const [brandProfile, setBrandProfile] = useState<BrandProfile>(INITIAL_BRAND_PROFILE);
  const [stores, setStores] = useState<Store[]>(SEED_STORES);
  const [activeStoreId, setActiveStoreId] = useState<string>('store-1');
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>(SEED_BUSINESS_OWNERS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(SEED_DELIVERIES);
  const [returnBookings, setReturnBookings] = useState<ReturnBooking[]>(SEED_RETURN_BOOKINGS);
  const [reviewerDirectoryList, setReviewerDirectoryList] = useState<ReviewerProfile[]>(SEED_REVIEWER_DIRECTORY_LIST);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [rewards, setRewards] = useState<RewardItem[]>(SEED_REWARDS);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(SEED_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(SEED_WITHDRAWALS);
  const [ambassadorContracts, setAmbassadorContracts] = useState<BrandAmbassadorContract[]>(SEED_AMBASSADOR_CONTRACTS);
  const [disputes, setDisputes] = useState<Dispute[]>(SEED_DISPUTES);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>(SEED_RISK_FLAGS);
  const [automations, setAutomations] = useState<AutomationRule[]>(SEED_AUTOMATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(SEED_LEADERBOARD);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(SEED_TRAINING_MODULES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);

  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
    });
  };
  
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Report a failed background sync-to-server call without disrupting the (already
  // applied) optimistic local state update.
  const onSyncError = (context: string) => (message: string) => {
    addToast(
      language === 'bn' ? 'সার্ভার সিঙ্ক ব্যর্থ' : 'Server Sync Failed',
      `${context}: ${message}`,
      'error'
    );
  };

  // Load live data from the backend API on mount, replacing the local seed data used
  // for the initial paint. Falls back to (and stays on) the seed data if the API is
  // unreachable, so the demo still works with the server offline.
  const hasLoadedFromServer = useRef(false);
  useEffect(() => {
    if (hasLoadedFromServer.current) return;
    hasLoadedFromServer.current = true;

    const setters: Record<string, (data: any) => void> = {
      '/reviewer-profile': setReviewerProfile,
      '/brand-profile': setBrandProfile,
      '/stores': setStores,
      '/business-owners': setBusinessOwners,
      '/deliveries': setDeliveries,
      '/return-bookings': setReturnBookings,
      '/reviewer-directory': setReviewerDirectoryList,
      '/products': setProducts,
      '/campaigns': setCampaigns,
      '/assignments': setAssignments,
      '/rewards': setRewards,
      '/redemptions': setRedemptions,
      '/transactions': setTransactions,
      '/withdrawals': setWithdrawals,
      '/ambassador-contracts': setAmbassadorContracts,
      '/disputes': setDisputes,
      '/risk-flags': setRiskFlags,
      '/automations': setAutomations,
      '/notifications': setNotifications,
      '/leaderboard': setLeaderboard,
      '/training-modules': setTrainingModules,
      '/audit-logs': setAuditLogs,
    };

    (async () => {
      const entries = Object.entries(setters);
      const results = await Promise.allSettled(entries.map(([path]) => api.get<any>(path)));
      let failures = 0;
      results.forEach((result, i) => {
        const [, setter] = entries[i];
        if (result.status === 'fulfilled' && result.value !== undefined) {
          setter(result.value);
        } else {
          failures++;
        }
      });
      if (failures === entries.length) {
        addToast(
          language === 'bn' ? 'API সার্ভারের সাথে সংযোগ ব্যর্থ' : 'Could Not Reach API Server',
          language === 'bn'
            ? 'ডেমো ডেটা দিয়ে চালানো হচ্ছে। server/README অনুযায়ী ব্যাকএন্ড চালু করুন।'
            : 'Running on local demo data. Start the backend in /server to persist changes.',
          'warning'
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateReviewerProfile = (updates: Partial<ReviewerProfile>) => {
    const patch: Partial<ReviewerProfile> = { ...updates };
    if (updates.careerXp !== undefined) {
      patch.levelId = getLevelByXp(updates.careerXp).id;
    }
    setReviewerProfile((prev) => ({ ...prev, ...patch }));
    syncToServer(api.patch('/reviewer-profile', patch), onSyncError('Reviewer profile'));
  };

  const submitOnboardingStep = (step: number, data: Partial<ReviewerProfile>) => {
    const patch = { ...data, onboardingStep: Math.min(5, step + 1) };
    setReviewerProfile((prev) => ({
      ...prev,
      ...patch,
    }));
    syncToServer(api.patch('/reviewer-profile', patch), onSyncError('Reviewer profile'));
    addToast(
      language === 'bn' ? 'ধাপ সংরক্ষিত হয়েছে' : 'Step Saved',
      language === 'bn' ? `অনবোর্ডিং ধাপ ${step} সফলভাবে সম্পন্ন হয়েছে।` : `Onboarding step ${step} completed.`,
      'success'
    );
  };

  const submitDemoReview = (videoUrl: string, notes: string) => {
    const demoSub = {
      id: `demo-${Date.now()}`,
      reviewerId: reviewerProfile.id,
      productType: 'Royal Oudh & Amber Attar',
      videoUrl,
      videoDurationSeconds: 82,
      submittedAt: new Date().toISOString(),
      notes,
      status: 'pending_review' as const,
    };
    
    const profilePatch = {
      demoSubmission: demoSub,
      verificationStatus: 'under_review' as const,
      onboardingStep: 5,
    };
    setReviewerProfile((prev) => ({
      ...prev,
      ...profilePatch,
    }));
    syncToServer(api.patch('/reviewer-profile', profilePatch), onSyncError('Reviewer profile'));

    // Add audit log
    const newAuditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: reviewerProfile.userId,
      actorName: reviewerProfile.fullName,
      actorRole: 'reviewer',
      action: 'SUBMIT_DEMO_REVIEW',
      targetEntity: 'DemoSubmission',
      targetId: demoSub.id,
      ipAddress: '103.145.22.10',
      details: 'Reviewer submitted Attar demo test recording for admin QA.'
    };
    setAuditLogs((prev) => [newAuditLog, ...prev]);
    syncToServer(api.post('/audit-logs', newAuditLog), onSyncError('Audit log'));

    addToast(
      language === 'bn' ? 'ডেমো টেস্ট সাবমিট হয়েছে!' : 'Demo Test Submitted!',
      language === 'bn' ? 'আপনার ডেমো টেস্ট অ্যাডমিন কিউতে জমা হয়েছে। ৪৮ ঘণ্টার মধ্যে ফলাফল পাবেন।' : 'Demo test is queued for admin evaluation.',
      'success'
    );
  };

  const updateBrandProfile = (updates: Partial<BrandProfile>) => {
    setBrandProfile((prev) => ({ ...prev, ...updates }));
    syncToServer(api.patch('/brand-profile', updates), onSyncError('Brand profile'));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    syncToServer(api.post('/products', newProduct), onSyncError('Product'));
    addToast(
      language === 'bn' ? 'নতুন পণ্য যুক্ত হয়েছে' : 'Product Added',
      `${newProduct.name}`,
      'success'
    );
    return newProduct;
  };

  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'reviewersHired' | 'submissionsApproved'>): Campaign => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      reviewersHired: 0,
      submissionsApproved: 0,
      createdAt: new Date().toISOString(),
    };
    
    setCampaigns((prev) => [newCampaign, ...prev]);
    syncToServer(api.post('/campaigns', newCampaign), onSyncError('Campaign'));

    // Update brand stats & escrow
    const brandPatch = {
      activeCampaignsCount: brandProfile.activeCampaignsCount + 1,
      escrowBalanceBdt: brandProfile.escrowBalanceBdt + newCampaign.budget.grandTotalBdt,
      totalSpentBdt: brandProfile.totalSpentBdt + newCampaign.budget.grandTotalBdt,
    };
    setBrandProfile((prev) => ({
      ...prev,
      ...brandPatch,
    }));
    syncToServer(api.patch('/brand-profile', brandPatch), onSyncError('Brand profile'));

    // Add transaction log
    const newTransaction: WalletTransaction = {
      id: `tx-escrow-${Date.now()}`,
      userId: brandProfile.userId,
      type: 'escrow_deposit',
      amountBdt: newCampaign.budget.grandTotalBdt,
      status: 'completed',
      descriptionBn: `ক্যাম্পেইন এস্ক্রো ফান্ড জমা: ${newCampaign.title}`,
      descriptionEn: `Campaign escrow funded: ${newCampaign.title}`,
      referenceId: newCampaign.id,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    syncToServer(api.post('/transactions', newTransaction), onSyncError('Transaction'));

    addToast(
      language === 'bn' ? 'ক্যাম্পেইন সফলভাবে তৈরি হয়েছে!' : 'Campaign Created!',
      language === 'bn' ? 'এস্ক্রো সুরক্ষিত হয়েছে এবং রিভিউয়ারদের কাছে সুযোগ উন্মুক্ত হয়েছে।' : 'Escrow secured and published to matched reviewers.',
      'success'
    );
    triggerConfetti();
    return newCampaign;
  };

  const applyToCampaign = (campaignId: string) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    
    const newAssignment: Assignment = {
      id: `asgn-${Date.now()}`,
      campaignId: camp.id,
      campaignTitle: camp.title,
      brandId: camp.brandId,
      brandName: camp.brandName,
      brandLogoUrl: camp.brandLogoUrl,
      reviewerId: reviewerProfile.id,
      reviewerName: reviewerProfile.fullName,
      reviewerAvatarUrl: reviewerProfile.avatarUrl,
      reviewerTrustScore: reviewerProfile.trustScore,
      productId: camp.productId,
      productName: camp.productName,
      productImageUrl: camp.productImageUrl,
      status: 'product_preparing',
      payoutBdt: camp.reviewerRewardBdt,
      careerXp: camp.careerXpReward,
      rewardCoins: camp.rewardCoinsReward,
      isReturnRequired: camp.isReturnRequired,
      assignedAt: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + (camp.brief.testingDurationDays + 4) * 86400000).toISOString(),
      revisions: [],
    };
    
    setAssignments((prev) => [newAssignment, ...prev]);
    syncToServer(api.post('/assignments', newAssignment), onSyncError('Assignment'));

    const campaignPatch = { reviewersHired: camp.reviewersHired + 1 };
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...campaignPatch } : c))
    );
    syncToServer(api.patch(`/campaigns/${campaignId}`, campaignPatch), onSyncError('Campaign'));
    
    addToast(
      language === 'bn' ? 'ক্যাম্পেইনে আবেদন গৃহীত হয়েছে!' : 'Application Accepted!',
      language === 'bn' ? 'ব্র্যান্ড প্রোডাক্ট পাঠানোর প্রস্তুতি নিচ্ছে। "My Tasks" এ চেক করুন।' : 'Brand is preparing product dispatch. Check My Tasks.',
      'success'
    );
    setActiveReviewerTab('tasks');
  };

  const confirmProductReceipt = (assignmentId: string) => {
    const current = assignments.find((a) => a.id === assignmentId);
    const patch = {
      status: 'product_received' as AssignmentStatus,
      receivedAt: new Date().toISOString(),
      shipment: current?.shipment
        ? { ...current.shipment, receivedConfirmed: true, deliveryDate: new Date().toISOString() }
        : undefined,
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...patch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, patch), onSyncError('Assignment'));
    addToast(
      language === 'bn' ? 'প্রোডাক্ট প্রাপ্তি নিশ্চিত হয়েছে' : 'Product Receipt Confirmed',
      language === 'bn' ? 'এখন টেস্টিং শুরু করে আনবক্সিং ও ব্যবহারের সৎ অভিজ্ঞতা নোট করুন।' : 'Start your testing and observe true product performance.',
      'info'
    );
  };

  const reportDamagedProduct = (assignmentId: string, reason: string) => {
    const current = assignments.find((a) => a.id === assignmentId);
    const patch = {
      shipment: current?.shipment
        ? { ...current.shipment, damagedReported: true, damageReportReason: reason }
        : undefined,
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...patch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, patch), onSyncError('Assignment'));
    createDispute(assignmentId, 'wrong_damaged_product', `রিভিউয়ার ক্ষতিগ্রস্ত প্রোডাক্ট রিপোর্ট করেছেন: ${reason}`);
  };

  const startProductTesting = (assignmentId: string) => {
    const patch = {
      status: 'testing_started' as AssignmentStatus,
      testingStartedAt: new Date().toISOString(),
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...patch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, patch), onSyncError('Assignment'));
    addToast(
      language === 'bn' ? 'টেস্টিং ফেজ শুরু হয়েছে ⏱️' : 'Testing Started ⏱️',
      language === 'bn' ? 'প্রোডাক্টের সুবিধা ও অসুবিধা দুটোই নিরপেক্ষভাবে রেকর্ড করুন।' : 'Test thoroughly over the required duration.',
      'info'
    );
  };

  const submitAssignmentReview = (
    assignmentId: string,
    videoUrl: string,
    summary: string,
    pros: string[],
    cons: string[],
    rating: number,
    notes?: string
  ) => {
    setAssignments((prev) =>
      prev.map((asgn) => {
        if (asgn.id === assignmentId) {
          const newSubmission = {
            id: `sub-${assignmentId}-${Date.now()}`,
            assignmentId,
            version: (asgn.submission?.version || 0) + 1,
            videoUrl,
            videoDurationSeconds: 95,
            writtenReviewSummary: summary,
            honestPros: pros,
            honestCons: cons,
            overallRatingGiven: rating,
            disclosureIncluded: true,
            submittedAt: new Date().toISOString(),
            notesToBrand: notes,
            editHistory: [
              ...(asgn.submission?.editHistory || []),
              {
                version: (asgn.submission?.version || 0) + 1,
                submittedAt: new Date().toISOString(),
                videoUrl,
                changesNote: 'Submitted review package',
              },
            ],
          };
          
          return {
            ...asgn,
            status: 'submitted' as AssignmentStatus,
            submittedAt: new Date().toISOString(),
            submission: newSubmission,
          };
        }
        return asgn;
      })
    );
    const submittedAssignment = assignments.find((a) => a.id === assignmentId);
    if (submittedAssignment) {
      syncToServer(
        api.patch(`/assignments/${assignmentId}`, {
          status: 'submitted',
          submittedAt: new Date().toISOString(),
          submission: {
            id: `sub-${assignmentId}-${Date.now()}`,
            assignmentId,
            version: (submittedAssignment.submission?.version || 0) + 1,
            videoUrl,
            videoDurationSeconds: 95,
            writtenReviewSummary: summary,
            honestPros: pros,
            honestCons: cons,
            overallRatingGiven: rating,
            disclosureIncluded: true,
            submittedAt: new Date().toISOString(),
            notesToBrand: notes,
            editHistory: [
              ...(submittedAssignment.submission?.editHistory || []),
              {
                version: (submittedAssignment.submission?.version || 0) + 1,
                submittedAt: new Date().toISOString(),
                videoUrl,
                changesNote: 'Submitted review package',
              },
            ],
          },
        }),
        onSyncError('Assignment')
      );
    }
    
    addToast(
      language === 'bn' ? 'রিভিউ সাবমিট হয়েছে!' : 'Review Submitted!',
      language === 'bn' ? 'ব্র্যান্ড ও কোয়ালিটি টিম পর্যালোচনা করছে।' : 'Review sent for brand QA verification.',
      'success'
    );
  };

  const requestAssignmentRevision = (
    assignmentId: string,
    reasonCategory: 'factual_error' | 'missing_mandatory_shot' | 'audio_video_quality' | 'policy_violation',
    details: string,
    timestampMarkers?: string[]
  ) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      requestedBy: 'brand' as const,
      reasonCategory,
      feedbackDetails: details,
      timestampMarkers,
      isResolved: false,
    };
    const targetAssignment = assignments.find((a) => a.id === assignmentId);
    const revisionsPatch = {
      status: 'revision_requested' as AssignmentStatus,
      revisions: [...(targetAssignment?.revisions || []), newRev],
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...revisionsPatch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, revisionsPatch), onSyncError('Assignment'));
    
    addToast(
      language === 'bn' ? 'সংশোধন অনুরোধ পাঠানো হয়েছে' : 'Revision Requested',
      language === 'bn' ? 'রিভিউয়ারকে সুনির্দিষ্ট পরিবর্তনের জন্য নোটিফিকেশন পাঠানো হয়েছে।' : 'Reviewer has been notified with exact feedback guidelines.',
      'warning'
    );
  };

  const approveAssignmentSubmission = (
    assignmentId: string,
    ratingBreakdown?: QualityRating['scores'],
    publicNotes?: string
  ) => {
    const target = assignments.find((a) => a.id === assignmentId);
    const earnedBdt = target?.payoutBdt || 0;
    const earnedXp = target?.careerXp || 0;
    const earnedCoins = target?.rewardCoins || 0;

    const qualityRating: QualityRating = {
      id: `qr-${Date.now()}`,
      assignmentId,
      reviewerId: target?.reviewerId || '',
      ratedByAdminId: 'user-admin-1',
      ratedByName: 'Platform QA Lead',
      ratedAt: new Date().toISOString(),
      scores: ratingBreakdown || {
        authenticity: 5,
        communication: 5,
        videoQuality: 5,
        audioQuality: 5,
        briefCompliance: 5,
        timeliness: 5,
        productDemonstration: 5,
        overallUsefulness: 5,
      },
      totalAverageScore: 4.9,
      publicNotes: publicNotes || 'চমৎকার সততাপূর্ণ ও ব্রিফ অনুযায়ী তৈরি রিভিউ।',
      internalNotes: 'Payment released immediately from Escrow.',
    };

    const assignmentPatch = {
      status: target?.isReturnRequired ? ('return_pending' as AssignmentStatus) : ('approved' as AssignmentStatus),
      approvedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      adminQualityRating: qualityRating,
    };

    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...assignmentPatch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, assignmentPatch), onSyncError('Assignment'));

    // Release payout to reviewer
    if (earnedBdt > 0) {
      const newXp = reviewerProfile.careerXp + earnedXp;
      const newCoins = reviewerProfile.rewardCoins + earnedCoins;
      const lvl = getLevelByXp(newXp);
      const profilePatch = {
        careerXp: newXp,
        rewardCoins: newCoins,
        levelId: lvl.id,
        tasksCompleted: reviewerProfile.tasksCompleted + 1,
        trustScore: Math.min(100, reviewerProfile.trustScore + 2),
      };
      setReviewerProfile((prev) => ({ ...prev, ...profilePatch }));
      syncToServer(api.patch('/reviewer-profile', profilePatch), onSyncError('Reviewer profile'));

      // Add transaction
      const newTransaction: WalletTransaction = {
        id: `tx-earn-${Date.now()}`,
        userId: reviewerProfile.userId,
        type: 'task_earning',
        amountBdt: earnedBdt,
        xpDelta: earnedXp,
        coinsDelta: earnedCoins,
        status: 'completed',
        descriptionBn: `টাস্ক পেআউট রিলিজ হয়েছে (+৳${earnedBdt})`,
        descriptionEn: `Task payout released (+৳${earnedBdt})`,
        referenceId: assignmentId,
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      syncToServer(api.post('/transactions', newTransaction), onSyncError('Transaction'));
    }

    addToast(
      language === 'bn' ? 'রিভিউ অনুমোদিত ও পেআউট রিলিজ হয়েছে! 💰' : 'Review Approved & Payout Released! 💰',
      language === 'bn' ? `৳${earnedBdt} আপনার ওয়ালেটে জমা হয়েছে এবং +${earnedXp} Career XP ও +${earnedCoins} Coins যুক্ত হয়েছে!` : `৳${earnedBdt} credited to wallet with +${earnedXp} Career XP!`,
      'success'
    );
    soundManager.playPaymentChime();
    soundManager.triggerHaptic([50, 40, 90, 40, 140]);
    triggerConfetti();
  };

  const confirmReturnShipped = (assignmentId: string, courierName: string, trackingId: string) => {
    const patch = {
      returnShipment: {
        courierName,
        trackingId,
        returnDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
        isReturnReceived: false,
      },
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...patch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, patch), onSyncError('Assignment'));
    addToast(
      language === 'bn' ? 'রিটার্ন কুরিয়ার ট্র্যাকিং আপডেট হয়েছে' : 'Return Shipped',
      `Tracking ID: ${trackingId} (${courierName})`,
      'info'
    );
  };

  const confirmReturnReceived = (assignmentId: string) => {
    const current = assignments.find((a) => a.id === assignmentId);
    const patch = {
      status: 'closed' as AssignmentStatus,
      returnCompletedAt: new Date().toISOString(),
      returnShipment: current?.returnShipment
        ? { ...current.returnShipment, isReturnReceived: true, returnReceivedDate: new Date().toISOString() }
        : undefined,
    };
    setAssignments((prev) =>
      prev.map((asgn) => (asgn.id === assignmentId ? { ...asgn, ...patch } : asgn))
    );
    syncToServer(api.patch(`/assignments/${assignmentId}`, patch), onSyncError('Assignment'));
    addToast(
      language === 'bn' ? 'প্রোডাক্ট রিটার্ন সম্পন্ন ও টাস্ক ক্লোজড' : 'Return Received & Task Closed',
      language === 'bn' ? 'ব্র্যান্ড প্রোডাক্ট অক্ষত অবস্থায় ফেরত পেয়েছে।' : 'Brand confirmed return parcel receipt.',
      'success'
    );
  };

  const redeemReward = (rewardId: string, shippingAddress: string, phone: string): boolean => {
    const item = rewards.find((r) => r.id === rewardId);
    if (!item) return false;

    if (reviewerProfile.rewardCoins < item.coinsCost) {
      addToast(
        language === 'bn' ? 'অপর্যাপ্ত Reward Coins' : 'Insufficient Reward Coins',
        language === 'bn' ? `এই গিফটের জন্য ${item.coinsCost} কয়েন প্রয়োজন। আপনার আছে ${reviewerProfile.rewardCoins} কয়েন।` : `Requires ${item.coinsCost} coins.`,
        'error'
      );
      return false;
    }

    if (item.stock <= 0) {
      addToast(language === 'bn' ? 'স্টক শেষ' : 'Out of Stock', 'এই রিওয়ার্ডটি বর্তমানে স্টকে নেই।', 'warning');
      return false;
    }

    // Deduct coins (Career XP remains strictly untouched!)
    const newCoinBalance = reviewerProfile.rewardCoins - item.coinsCost;
    setReviewerProfile((prev) => ({
      ...prev,
      rewardCoins: newCoinBalance,
    }));
    syncToServer(api.patch('/reviewer-profile', { rewardCoins: newCoinBalance }), onSyncError('Reviewer profile'));

    // Decrement stock
    const newStock = item.stock - 1;
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, stock: newStock } : r))
    );
    syncToServer(api.patch(`/rewards/${rewardId}`, { stock: newStock }), onSyncError('Reward'));

    const newRedemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      reviewerId: reviewerProfile.id,
      reviewerName: reviewerProfile.fullName,
      rewardItemId: item.id,
      rewardTitleBn: item.titleBn,
      rewardTitleEn: item.titleEn,
      coinsSpent: item.coinsCost,
      status: 'requested',
      shippingAddress,
      recipientPhone: phone,
      requestedAt: new Date().toISOString(),
    };

    setRedemptions((prev) => [newRedemption, ...prev]);
    syncToServer(api.post('/redemptions', newRedemption), onSyncError('Redemption'));

    // Transaction
    const newTransaction: WalletTransaction = {
      id: `tx-red-${Date.now()}`,
      userId: reviewerProfile.userId,
      type: 'coin_spend',
      amountBdt: 0,
      coinsDelta: -item.coinsCost,
      status: 'completed',
      descriptionBn: `রিওয়ার্ড রিডিম: ${item.titleBn} (-${item.coinsCost} Coins)`,
      descriptionEn: `Reward redeemed: ${item.titleEn}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    syncToServer(api.post('/transactions', newTransaction), onSyncError('Transaction'));

    addToast(
      language === 'bn' ? 'রিওয়ার্ড রিডিম সফল হয়েছে! 🎉' : 'Reward Redeemed! 🎉',
      language === 'bn' ? `${item.titleBn} আপনার ঠিকানায় পাঠানো হচ্ছে। ক্যারিয়ার XP অক্ষত রয়েছে!` : `Order placed for ${item.titleEn}. Career XP remains permanent!`,
      'success'
    );
    triggerConfetti();
    return true;
  };

  const requestWithdrawal = (
    amount: number,
    method: 'bkash' | 'nagad' | 'bank',
    accountNumber: string,
    bankDetails?: any
  ): boolean => {
    // Calculate total available balance
    const availableBalance = transactions
      .filter((t) => t.status === 'completed')
      .reduce((acc, t) => {
        if (t.type === 'task_earning' || t.type === 'ambassador_payout') return acc + t.amountBdt;
        if (t.type === 'withdrawal') return acc - t.amountBdt;
        return acc;
      }, 0);

    if (amount > availableBalance) {
      addToast(
        language === 'bn' ? 'উত্তোলন ব্যর্থ' : 'Withdrawal Failed',
        language === 'bn' ? `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${availableBalance}` : `Insufficient balance. Available: ৳${availableBalance}`,
        'error'
      );
      return false;
    }

    if (amount < 500) {
      addToast(
        language === 'bn' ? 'নূন্যতম উত্তোলন ৳৫০০' : 'Minimum Withdrawal ৳500',
        language === 'bn' ? 'কমপক্ষে ৫০০ টাকা উত্তোলনের অনুরোধ করতে হবে।' : 'Minimum payout threshold is ৳500.',
        'warning'
      );
      return false;
    }

    const newReq: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      reviewerId: reviewerProfile.id,
      reviewerName: reviewerProfile.fullName,
      amountBdt: amount,
      method,
      accountNumberMasked: accountNumber.slice(0, 3) + '•••••' + accountNumber.slice(-3),
      bankDetails,
      status: 'requested',
      requestedAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newReq, ...prev]);
    syncToServer(api.post('/withdrawals', newReq), onSyncError('Withdrawal'));

    // Record pending transaction
    const newTransaction: WalletTransaction = {
      id: `tx-wth-${Date.now()}`,
      userId: reviewerProfile.userId,
      type: 'withdrawal',
      amountBdt: amount,
      status: 'pending',
      descriptionBn: `${method.toUpperCase()} এ ৳${amount} উত্তোলনের অনুরোধ জমা হয়েছে`,
      descriptionEn: `Withdrawal of ৳${amount} requested via ${method.toUpperCase()}`,
      referenceId: newReq.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    syncToServer(api.post('/transactions', newTransaction), onSyncError('Transaction'));

    addToast(
      language === 'bn' ? 'উত্তোলনের অনুরোধ জমা হয়েছে' : 'Withdrawal Requested',
      language === 'bn' ? `৳${amount} আপনার ${method.toUpperCase()} একাউন্টে প্রক্রিয়াকরণ শুরু হয়েছে।` : `৳${amount} payout request submitted.`,
      'success'
    );
    return true;
  };

  const createDispute = (
    assignmentId: string,
    reason: Dispute['reason'],
    description: string,
    evidenceUrls?: string[]
  ) => {
    const asgn = assignments.find((a) => a.id === assignmentId);
    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      assignmentId,
      campaignTitle: asgn?.campaignTitle || 'Product Test Dispute',
      raisedByRole: currentRole === 'reviewer' ? 'reviewer' : 'brand',
      raisedById: currentRole === 'reviewer' ? reviewerProfile.id : brandProfile.id,
      raisedByName: currentRole === 'reviewer' ? reviewerProfile.fullName : brandProfile.brandName,
      counterPartyName: currentRole === 'reviewer' ? asgn?.brandName || 'Brand' : asgn?.reviewerName || 'Reviewer',
      reason,
      description,
      evidenceUrls: evidenceUrls || [],
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: currentRole === 'reviewer' ? 'reviewer' : 'brand',
          senderName: currentRole === 'reviewer' ? reviewerProfile.fullName : brandProfile.brandName,
          message: description,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    syncToServer(api.post('/disputes', newDispute), onSyncError('Dispute'));
    addToast(
      language === 'bn' ? 'অভিযোগ/ডিস্পিউট নিবন্ধিত হয়েছে' : 'Dispute Raised',
      language === 'bn' ? 'পিংডলার অ্যাডমিন টিম উভয়পক্ষের সাক্ষ্যপ্রমাণ নিরীক্ষা করে সিদ্ধান্ত জানাবে।' : 'PingDollar arbitration team will review the dispute within 24h.',
      'info'
    );
  };

  const addDisputeMessage = (disputeId: string, message: string) => {
    const senderRole = currentRole === 'reviewer' ? 'reviewer' : currentRole === 'brand' ? 'brand' : 'admin';
    const senderName = currentRole === 'reviewer' ? reviewerProfile.fullName : currentRole === 'brand' ? brandProfile.brandName : 'Platform Admin';
    const targetDispute = disputes.find((d) => d.id === disputeId);
    const patch = {
      updatedAt: new Date().toISOString(),
      messages: [
        ...(targetDispute?.messages || []),
        {
          id: `msg-${Date.now()}`,
          senderRole,
          senderName,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, ...patch } : d))
    );
    syncToServer(api.patch(`/disputes/${disputeId}`, patch), onSyncError('Dispute'));
  };

  const resolveDispute = (
    disputeId: string,
    resolutionSummary: string,
    fundsAction: 'release_to_reviewer' | 'refund_to_brand' | 'split_payout',
    reviewerAmount?: number,
    brandRefundAmount?: number
  ) => {
    const patch = {
      status: 'resolved' as const,
      adminDecision: {
        resolutionSummary,
        fundsAction,
        reviewerPayoutBdt: reviewerAmount,
        brandRefundBdt: brandRefundAmount,
        decidedByAdminName: 'ফাহিম রহমান (Chief Dispute Arbiter)',
        decidedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, ...patch } : d))
    );
    syncToServer(api.patch(`/disputes/${disputeId}`, patch), onSyncError('Dispute'));
    addToast(
      language === 'bn' ? 'ডিস্পিউট চূড়ান্তভাবে নিষ্পত্তি হয়েছে' : 'Dispute Resolved',
      resolutionSummary,
      'success'
    );
  };

  const resolveRiskFlag = (flagId: string, action: 'dismissed' | 'warning_issued' | 'restricted', note: string) => {
    const patch = {
      status: action,
      reviewedByAdmin: 'ফাহিম রহমান',
      resolutionNote: note,
    };
    setRiskFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, ...patch } : f))
    );
    syncToServer(api.patch(`/risk-flags/${flagId}`, patch), onSyncError('Risk flag'));
    addToast(language === 'bn' ? 'রিস্ক ফ্ল্যাগ অডিট সম্পন্ন' : 'Risk Flag Audited', `Action: ${action}`, 'info');
  };

  const toggleAutomationRule = (ruleId: string) => {
    const rule = automations.find((r) => r.id === ruleId);
    const patch = { isEnabled: !(rule?.isEnabled ?? false) };
    setAutomations((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, ...patch } : r))
    );
    syncToServer(api.patch(`/automations/${ruleId}`, patch), onSyncError('Automation'));
  };

  const triggerAutomationTest = (ruleId: string) => {
    const rule = automations.find((r) => r.id === ruleId);
    if (!rule) return;

    const patch = { executionsCount: rule.executionsCount + 1, lastTriggeredAt: new Date().toISOString() };
    setAutomations((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, ...patch } : r))
    );
    syncToServer(api.patch(`/automations/${ruleId}`, patch), onSyncError('Automation'));

    addToast(
      language === 'bn' ? 'অটোমেশন ট্রিগার সফল 🚀' : 'Automation Triggered 🚀',
      `${rule.name} (Channel: ${rule.actionType})`,
      'success'
    );
  };

  const adminApproveReviewer = (reviewerId: string, approve: boolean, notes?: string) => {
    const patch = {
      verificationStatus: approve ? 'verified' as const : 'rejected' as const,
      isApplicationApproved: approve,
      verificationNotes: notes || (approve ? 'NID ও সেলফি বায়োমেট্রিক সফলভাবে ভেরিফাইড।' : 'তথ্য অসঙ্গতির কারণে বাতিল করা হয়েছে।'),
      verificationDate: new Date().toISOString(),
    };
    setReviewerProfile((prev) => ({
      ...prev,
      ...patch,
    }));
    syncToServer(api.patch('/reviewer-profile', patch), onSyncError('Reviewer profile'));

    addToast(
      approve ? 'রিভিউয়ার অনুমোদিত হয়েছে!' : 'রিভিউয়ার বাতিল করা হয়েছে',
      approve ? 'রিভিউয়ারের জন্য সম্পূর্ণ ড্যাশবোর্ড ও টাস্ক উন্মুক্ত হয়েছে।' : 'Reviewer status updated.',
      approve ? 'success' : 'warning'
    );
  };

  const adminRateDemoVideo = (
    reviewerId: string,
    scores: NonNullable<ReviewerProfile['demoSubmission']>['rubricScores'],
    feedback: string,
    approve: boolean
  ) => {
    const patch = {
      demoSubmission: reviewerProfile.demoSubmission
        ? {
            ...reviewerProfile.demoSubmission,
            status: approve ? ('approved' as const) : ('rejected' as const),
            adminFeedback: feedback,
            rubricScores: scores,
            reviewedBy: 'ফাহিম রহমান (QA Lead)',
            reviewedAt: new Date().toISOString(),
          }
        : undefined,
      verificationStatus: approve ? ('verified' as const) : ('resubmission_required' as const),
      isApplicationApproved: approve,
      trustScore: approve ? 90 : 65,
      careerXp: approve ? reviewerProfile.careerXp + 200 : reviewerProfile.careerXp,
    };
    setReviewerProfile((prev) => ({
      ...prev,
      ...patch,
    }));
    syncToServer(api.patch('/reviewer-profile', patch), onSyncError('Reviewer profile'));

    addToast(
      approve ? 'ডেমো ভিডিও সফলভাবে মূল্যায়িত ও অনুমোদিত!' : 'ডেমো ভিডিওতে রি-সাবমিশন চাওয়া হয়েছে',
      feedback,
      approve ? 'success' : 'warning'
    );
    if (approve) triggerConfetti();
  };

  const adminApproveBrand = (brandId: string, approve: boolean) => {
    const patch = {
      verificationStatus: approve ? ('verified' as const) : ('rejected' as const),
      verificationNotes: approve ? 'ট্রেড লাইসেন্স ও কোম্পানির দলিল যাচাইকৃত।' : 'ট্রেড লাইসেন্সে অসঙ্গতি পাওয়া গেছে।',
    };
    setBrandProfile((prev) => ({
      ...prev,
      ...patch,
    }));
    syncToServer(api.patch('/brand-profile', patch), onSyncError('Brand profile'));
    addToast(
      approve ? 'ব্র্যান্ড প্রোফাইল অনুমোদিত' : 'ব্র্যান্ড প্রোফাইল বাতিল',
      'Brand verification state updated.',
      approve ? 'success' : 'warning'
    );
  };

  const adminApproveCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: 'active' } : c))
    );
    syncToServer(api.patch(`/campaigns/${campaignId}`, { status: 'active' }), onSyncError('Campaign'));
    addToast('ক্যাম্পেইন লাইভ করা হয়েছে', 'Campaign is now active for eligible reviewers.', 'success');
  };

  const adminProcessWithdrawal = (withdrawalId: string, approve: boolean, trxId?: string) => {
    const withdrawalPatch = {
      status: approve ? ('paid' as const) : ('rejected' as const),
      transactionId: trxId || `TRX-${Date.now()}`,
      processedAt: new Date().toISOString(),
    };
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, ...withdrawalPatch } : w))
    );
    syncToServer(api.patch(`/withdrawals/${withdrawalId}`, withdrawalPatch), onSyncError('Withdrawal'));

    const relatedTransactions = transactions.filter((t) => t.referenceId === withdrawalId);
    const transactionStatus = approve ? ('completed' as const) : ('failed' as const);
    setTransactions((prev) =>
      prev.map((t) => (t.referenceId === withdrawalId ? { ...t, status: transactionStatus } : t))
    );
    relatedTransactions.forEach((t) => {
      syncToServer(api.patch(`/transactions/${t.id}`, { status: transactionStatus }), onSyncError('Transaction'));
    });

    addToast(
      approve ? 'টাকা উত্তোলন সম্পন্ন হয়েছে' : 'উত্তোলন বাতিল করা হয়েছে',
      approve ? `Transaction ID: ${trxId || 'Auto'}` : 'Withdrawal rejected.',
      approve ? 'success' : 'error'
    );
  };

  const completeTrainingModule = (moduleId: string) => {
    const mod = trainingModules.find((m) => m.id === moduleId);
    if (!mod || mod.isCompleted) return;

    setTrainingModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isCompleted: true } : m))
    );
    syncToServer(api.patch(`/training-modules/${moduleId}`, { isCompleted: true }), onSyncError('Training module'));

    const newXp = reviewerProfile.careerXp + mod.xpReward;
    const lvl = getLevelByXp(newXp);
    const profilePatch = { careerXp: newXp, levelId: lvl.id };
    setReviewerProfile((prev) => ({
      ...prev,
      ...profilePatch,
    }));
    syncToServer(api.patch('/reviewer-profile', profilePatch), onSyncError('Reviewer profile'));

    addToast(
      language === 'bn' ? 'ট্রেনিং সম্পন্ন! 🎓' : 'Training Completed! 🎓',
      language === 'bn' ? `+${mod.xpReward} Career XP এবং ${mod.badgeReward || ''} অর্জিত হয়েছে!` : `+${mod.xpReward} Career XP awarded!`,
      'success'
    );
    triggerConfetti();
  };

  // Store Management
  const addStore = (storeData: Partial<Store>): Store => {
    const owner = businessOwners[0];
    const newStore: Store = {
      id: `store-${Date.now()}`,
      ownerId: owner?.id || 'owner-1',
      ownerName: owner?.fullName || 'আহসান হাবীব',
      name: storeData.name || 'New Brand Store',
      tagline: storeData.tagline || '',
      category: storeData.category || 'General',
      logoUrl: storeData.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&auto=format&fit=crop&q=80',
      description: storeData.description || '',
      verificationStatus: 'under_admin_review',
      createdAt: new Date().toISOString(),
      activeCampaignsCount: 0,
      totalProductsCount: 0,
      totalReviewersHired: 0,
      escrowBalanceBdt: 0,
      pickupAddress: storeData.pickupAddress || {
        contactPerson: owner?.fullName || 'Manager',
        phone: owner?.phone || '+880 1711-000000',
        district: 'Dhaka',
        fullAddress: 'Dhaka, Bangladesh',
        preferredCourier: 'steadfast'
      },
      returnAddress: storeData.returnAddress || {
        contactPerson: owner?.fullName || 'Returns Dept',
        phone: owner?.phone || '+880 1711-000000',
        district: 'Dhaka',
        fullAddress: 'Dhaka, Bangladesh',
        preferredCourier: 'steadfast'
      },
      teamMembers: [
        {
          id: `tm-${Date.now()}`,
          name: owner?.fullName || 'Ahsan Habib',
          email: owner?.email || 'owner@bringdollar.com',
          role: 'owner',
          status: 'active',
          joinedAt: new Date().toISOString()
        }
      ],
      tradeLicenseNumber: storeData.tradeLicenseNumber || 'TRAD/DSCC/0192837',
      deliverySuccessRate: 100,
      reviewCompletionRate: 100,
    };

    setStores((prev) => [newStore, ...prev]);
    syncToServer(api.post('/stores', newStore), onSyncError('Store'));

    const ownerStoreIdsPatch = owner ? { storeIds: [...owner.storeIds, newStore.id] } : undefined;
    setBusinessOwners((prev) =>
      prev.map((o) =>
        o.id === newStore.ownerId
          ? { ...o, storeIds: [...o.storeIds, newStore.id] }
          : o
      )
    );
    if (owner && ownerStoreIdsPatch) {
      syncToServer(api.patch(`/business-owners/${owner.id}`, ownerStoreIdsPatch), onSyncError('Business owner'));
    }

    addToast(
      language === 'bn' ? 'নতুন স্টোর সাবমিট হয়েছে!' : 'New Store Submitted!',
      language === 'bn'
        ? `"${newStore.name}" অ্যাডমিন অনুমোদনের জন্য জমা হয়েছে। অনুমোদনের পর ক্যাম্পেইন লাইভ করতে পারবেন।`
        : `"${newStore.name}" submitted for admin review.`,
      'info'
    );
    return newStore;
  };

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s))
    );
    syncToServer(api.patch(`/stores/${storeId}`, updates), onSyncError('Store'));
    addToast(
      language === 'bn' ? 'স্টোর তথ্য আপডেট হয়েছে' : 'Store Updated',
      'Store profile modified.',
      'success'
    );
  };

  const adminApproveStore = (storeId: string) => {
    const patch = {
      verificationStatus: 'approved' as const,
      verificationNotes: 'অ্যাডমিন কর্তৃক ট্রেড লাইসেন্স ও ব্র্যান্ড প্রমাণ যাচাইকৃত।',
      approvedAt: new Date().toISOString(),
    };
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...patch } : s))
    );
    syncToServer(api.patch(`/stores/${storeId}`, patch), onSyncError('Store'));
    addToast(
      language === 'bn' ? 'স্টোর অনুমোদিত হয়েছে! ✅' : 'Store Approved! ✅',
      'This store can now create and run product review campaigns.',
      'success'
    );
    triggerConfetti();
  };

  const adminRequestStoreChanges = (storeId: string, note: string) => {
    const patch = {
      verificationStatus: 'changes_requested' as const,
      verificationNotes: note,
    };
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...patch } : s))
    );
    syncToServer(api.patch(`/stores/${storeId}`, patch), onSyncError('Store'));
    addToast(
      language === 'bn' ? 'স্টোরে পরিবর্তন চাওয়া হয়েছে' : 'Store Changes Requested',
      note,
      'warning'
    );
  };

  const adminSuspendStore = (storeId: string, reason: string) => {
    const patch = {
      verificationStatus: 'suspended' as const,
      verificationNotes: `স্থগিতাদেশ কারণ: ${reason}`,
    };
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...patch } : s))
    );
    syncToServer(api.patch(`/stores/${storeId}`, patch), onSyncError('Store'));
    addToast(
      language === 'bn' ? 'স্টোর সাময়িক স্থগিত করা হয়েছে' : 'Store Suspended',
      reason,
      'error'
    );
  };

  // Logistics & Delivery Engine
  const createDeliveryShipment = (deliveryData: Partial<Delivery>): Delivery => {
    const courier = COURIER_PROVIDERS[deliveryData.courierProvider || 'steadfast'];
    const trackingId = generateTrackingId(deliveryData.courierProvider || 'steadfast');
    const newDelivery: Delivery = {
      id: `del-${Date.now()}`,
      storeId: deliveryData.storeId || activeStoreId,
      storeName: deliveryData.storeName || activeStore?.name || 'Aura Naturals BD',
      ownerId: deliveryData.ownerId || 'owner-1',
      campaignId: deliveryData.campaignId || 'camp-1',
      campaignTitle: deliveryData.campaignTitle || 'Product Campaign',
      assignmentId: deliveryData.assignmentId || 'asgn-1',
      reviewerId: deliveryData.reviewerId || 'rev-prof-1',
      reviewerName: deliveryData.reviewerName || 'তানভীর আহমেদ',
      reviewerPhone: deliveryData.reviewerPhone || '+880 1712-345678',
      reviewerAddress: deliveryData.reviewerAddress || {
        district: 'Dhaka',
        area: 'Dhanmondi',
        fullAddress: 'House 42, Road 9/A, Dhanmondi, Dhaka',
      },
      productId: deliveryData.productId || 'prod-1',
      productName: deliveryData.productName || 'Sample Product',
      productImageUrl: deliveryData.productImageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
      isReturnable: deliveryData.isReturnable ?? false,
      courierProvider: deliveryData.courierProvider || 'steadfast',
      courierName: courier.nameEn,
      trackingId,
      status: 'booking_confirmed',
      currentStatus: 'booking_confirmed',
      createdAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          id: `evt-${Date.now()}`,
          status: 'booking_confirmed',
          title: 'পার্সেল বুকিং কনফার্মড',
          description: `মার্চেন্ট থেকে পার্সেল পিকআপ বুক করা হয়েছে। (${courier.nameEn})`,
          location: 'Dhaka Central Hub',
          timestamp: new Date().toISOString(),
        }
      ],
      notes: deliveryData.notes,
    };

    setDeliveries((prev) => [newDelivery, ...prev]);
    syncToServer(api.post('/deliveries', newDelivery), onSyncError('Delivery'));

    // Update assignment with shipment tracking
    const assignmentShipmentPatch = {
      deliveryId: newDelivery.id,
      deliveryStatus: 'booking_confirmed' as DeliveryStatus,
      shipment: {
        courierName: courier.nameEn,
        trackingId,
        dispatchDate: newDelivery.dispatchedAt || new Date().toISOString(),
        receivedConfirmed: false,
      },
    };
    setAssignments((prev) =>
      prev.map((a) => (a.id === newDelivery.assignmentId ? { ...a, ...assignmentShipmentPatch } : a))
    );
    if (assignments.some((a) => a.id === newDelivery.assignmentId)) {
      syncToServer(
        api.patch(`/assignments/${newDelivery.assignmentId}`, assignmentShipmentPatch),
        onSyncError('Assignment')
      );
    }

    addToast(
      language === 'bn' ? 'কুরিয়ার বুকিং সম্পন্ন 🚚' : 'Courier Booking Created 🚚',
      `${courier.nameEn} Tracking ID: ${trackingId}`,
      'success'
    );
    return newDelivery;
  };

  const advanceDeliverySimulationStep = (deliveryId: string) => {
    const current = deliveries.find((d) => d.id === deliveryId);
    if (!current) return;

    const currentDeliveryStatus = current.status || current.currentStatus || 'booking_confirmed';
    const stepResult = getNextDeliveryStatus(currentDeliveryStatus);
    const nextStatus = stepResult.nextStatus;

    if (nextStatus === currentDeliveryStatus) {
      addToast(
        language === 'bn' ? 'ডেলিভারি চূড়ান্ত পর্যায়ে রয়েছে' : 'Delivery at Final Step',
        `Status: ${currentDeliveryStatus}`,
        'info'
      );
      return;
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      status: nextStatus,
      title: nextStatus === 'in_transit' ? 'হাব হতে স্থানান্তর (In-Transit)' :
             nextStatus === 'out_for_delivery' ? 'ডেলিভারি রাইডার রওনা দিয়েছেন' :
             nextStatus === 'delivered' ? 'সফলভাবে রিভিউয়ারের হাতে অর্পিত' : 'স্ট্যাটাস আপডেট',
      description: stepResult.eventDescription || (nextStatus === 'delivered'
        ? 'রিভিউয়ার পার্সেল গ্রহণ করেছেন। আনবক্সিং এবং আনপ্যাকিং টেস্ট শুরু করার নির্দেশ দেওয়া হয়েছে।'
        : `কুরিয়ার আপডেট (${current.courierName || 'Steadfast'}) - লোকেশন ট্র্যাকিং অ্যাক্টিভ`),
      location: stepResult.location || 'Dhaka Gateway Hub',
      timestamp: new Date().toISOString(),
    };

    const deliveryPatch = {
      status: nextStatus,
      currentStatus: nextStatus,
      deliveredAt: nextStatus === 'delivered' ? new Date().toISOString() : current.deliveredAt,
      events: [...(current.events || []), newEvent],
    };
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, ...deliveryPatch } : d))
    );
    syncToServer(api.patch(`/deliveries/${deliveryId}`, deliveryPatch), onSyncError('Delivery'));

    // Update corresponding assignment
    const targetAssignment = assignments.find((a) => a.id === current.assignmentId);
    if (targetAssignment) {
      const assignmentPatch = {
        deliveryStatus: nextStatus,
        receivedAt: nextStatus === 'delivered' ? new Date().toISOString() : targetAssignment.receivedAt,
        status: nextStatus === 'delivered' && (targetAssignment.status === 'assigned' || targetAssignment.status === 'product_dispatched' || targetAssignment.status === 'accepted') ? 'product_received' as AssignmentStatus : targetAssignment.status,
        shipment: targetAssignment.shipment
          ? {
              ...targetAssignment.shipment,
              deliveryDate: nextStatus === 'delivered' ? new Date().toISOString() : targetAssignment.shipment.deliveryDate,
              receivedConfirmed: nextStatus === 'delivered' ? true : targetAssignment.shipment.receivedConfirmed,
            }
          : undefined,
      };
      setAssignments((asgns) =>
        asgns.map((a) => (a.id === current.assignmentId ? { ...a, ...assignmentPatch } : a))
      );
      syncToServer(api.patch(`/assignments/${current.assignmentId}`, assignmentPatch), onSyncError('Assignment'));
    }

    addToast(
      language === 'bn' ? 'ডেলিভারি ট্র্যাকিং আপডেট 📦' : 'Delivery Step Advanced 📦',
      `${current.trackingId} → ${nextStatus.replace(/_/g, ' ').toUpperCase()}`,
      'success'
    );

    if (nextStatus === 'delivered') triggerConfetti();
  };

  const advanceReturnSimulationStep = (returnId: string) => {
    const current = returnBookings.find((r) => r.id === returnId);
    if (!current) return;

    const currentRetStatus = current.status || 'return_required';
    const stepResult = getNextReturnStatus(currentRetStatus);
    const nextStatus = stepResult.nextStatus;

    const newEvent = {
      id: `revt-${Date.now()}`,
      status: nextStatus,
      title: `রিটার্ন ধাপ: ${nextStatus}`,
      description: stepResult.eventDescription || `রিটার্ন পার্সেল ট্র্যাকিং আপডেট (${current.courierName || 'Courier'})`,
      location: 'Dhaka Return Depot',
      timestamp: new Date().toISOString(),
    };

    const returnPatch = {
      status: nextStatus,
      receivedAtBrandWarehouse: nextStatus === 'delivered_to_brand' || nextStatus === 'return_completed' ? new Date().toISOString() : current.receivedAtBrandWarehouse,
      events: [...(current.events || []), newEvent],
    };
    setReturnBookings((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, ...returnPatch } : r))
    );
    syncToServer(api.patch(`/return-bookings/${returnId}`, returnPatch), onSyncError('Return booking'));

    if (assignments.some((a) => a.id === current.assignmentId)) {
      setAssignments((asgns) =>
        asgns.map((a) => (a.id === current.assignmentId ? { ...a, returnStatus: nextStatus } : a))
      );
      syncToServer(
        api.patch(`/assignments/${current.assignmentId}`, { returnStatus: nextStatus }),
        onSyncError('Assignment')
      );
    }

    addToast(
      language === 'bn' ? 'রিটার্ন ট্র্যাকিং আপডেট 🔄' : 'Return Step Advanced 🔄',
      `${current.trackingId} → ${nextStatus}`,
      'info'
    );
  };

  const confirmReturnInspection = (returnId: string, isSatisfactory: boolean, brandNotes?: string) => {
    const patch = {
      status: isSatisfactory ? 'inspection_passed' : 'inspection_failed',
      conditionCheck: {
        isSatisfactory,
        brandNotes: brandNotes || (isSatisfactory ? 'পণ্যটি অক্ষত অবস্থায় বক্স সহ পাওয়া গেছে।' : 'পণ্যে অনাকাঙ্ক্ষিত ক্ষতি হয়েছে।'),
        checkedAt: new Date().toISOString(),
        checkedBy: 'Brand QA Inspector',
      },
    };
    setReturnBookings((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, ...patch } : r))
    );
    syncToServer(api.patch(`/return-bookings/${returnId}`, patch), onSyncError('Return booking'));

    addToast(
      isSatisfactory ? 'রিটার্ন ইন্সপেকশন পাস! ✅' : 'রিটার্ন ইন্সপেকশনে অসঙ্গতি ⚠️',
      isSatisfactory ? 'পণ্য অক্ষত পেয়ে এস্ক্রো ও পেমেন্ট সেটেলমেন্ট সম্পন্ন করা হয়েছে।' : 'ব্র্যান্ড কর্তৃক ইস্যু নথিভুক্ত হয়েছে।',
      isSatisfactory ? 'success' : 'warning'
    );
  };

  // Reviewer Directory Admin Actions
  const adminVerifyReviewerNid = (reviewerId: string, approve: boolean, notes?: string) => {
    const targetReviewer = reviewerDirectoryList.find((r) => r.id === reviewerId);
    const directoryPatch = {
      verificationStatus: approve ? ('verified' as const) : ('rejected' as const),
      isApplicationApproved: approve,
      trustScore: targetReviewer
        ? approve
          ? Math.min(100, targetReviewer.trustScore + 8)
          : Math.max(30, targetReviewer.trustScore - 15)
        : undefined,
      verificationNotes: notes || (approve ? 'NID এবং ফেস ম্যাচ সফলভাবে যাচাইকৃত।' : 'অস্পষ্ট NID ছবির কারণে বাতিল।'),
      verificationDate: new Date().toISOString(),
    };
    setReviewerDirectoryList((prev) =>
      prev.map((r) => (r.id === reviewerId ? { ...r, ...directoryPatch } : r))
    );
    syncToServer(api.patch(`/reviewer-directory/${reviewerId}`, directoryPatch), onSyncError('Reviewer directory'));

    if (reviewerProfile.id === reviewerId) {
      const profilePatch = {
        verificationStatus: directoryPatch.verificationStatus,
        isApplicationApproved: approve,
        trustScore: approve ? Math.min(100, reviewerProfile.trustScore + 8) : Math.max(30, reviewerProfile.trustScore - 15),
      };
      setReviewerProfile((prev) => ({
        ...prev,
        ...profilePatch,
      }));
      syncToServer(api.patch('/reviewer-profile', profilePatch), onSyncError('Reviewer profile'));
    }

    addToast(
      approve ? 'NID ভেরিফিকেশন সফল! 🆔' : 'NID ভেরিফিকেশন বাতিল',
      approve ? 'রিভিউয়ারের ট্রাস্ট স্কোর ও ভেরিফায়েড ব্যাজ যুক্ত হয়েছে।' : 'Reviewer NID rejected.',
      approve ? 'success' : 'warning'
    );
    if (approve) triggerConfetti();
  };

  const adminUpdateReviewerStatus = (reviewerId: string, status: ReviewerAccountStatus, note?: string) => {
    const target = reviewerDirectoryList.find((r) => r.id === reviewerId);
    const patch = {
      accountStatus: status,
      verificationNotes: note || target?.verificationNotes,
    };
    setReviewerDirectoryList((prev) =>
      prev.map((r) => (r.id === reviewerId ? { ...r, ...patch } : r))
    );
    syncToServer(api.patch(`/reviewer-directory/${reviewerId}`, patch), onSyncError('Reviewer directory'));
    addToast(
      language === 'bn' ? 'রিভিউয়ার স্ট্যাটাস আপডেট' : 'Reviewer Status Changed',
      `Reviewer ID: ${reviewerId} → ${status}`,
      'info'
    );
  };

  const adminAdjustTrustScore = (reviewerId: string, delta: number, reason: string) => {
    const target = reviewerDirectoryList.find((r) => r.id === reviewerId);
    if (target) {
      const newScore = Math.max(0, Math.min(100, target.trustScore + delta));
      setReviewerDirectoryList((prev) =>
        prev.map((r) => (r.id === reviewerId ? { ...r, trustScore: newScore } : r))
      );
      syncToServer(api.patch(`/reviewer-directory/${reviewerId}`, { trustScore: newScore }), onSyncError('Reviewer directory'));
    }

    if (reviewerProfile.id === reviewerId) {
      const newProfileScore = Math.max(0, Math.min(100, reviewerProfile.trustScore + delta));
      setReviewerProfile((prev) => ({
        ...prev,
        trustScore: newProfileScore,
      }));
      syncToServer(api.patch('/reviewer-profile', { trustScore: newProfileScore }), onSyncError('Reviewer profile'));
    }

    addToast(
      language === 'bn' ? 'ট্রাস্ট স্কোর পরিবর্তিত হয়েছে' : 'Trust Score Adjusted',
      `${delta > 0 ? `+${delta}` : delta} পয়েন্ট (${reason})`,
      delta > 0 ? 'success' : 'warning'
    );
  };

  const adminToggleAmbassadorStatus = (reviewerId: string) => {
    const target = reviewerDirectoryList.find((r) => r.id === reviewerId);
    const patch = { isAmbassador: !(target?.isAmbassador ?? false) };
    setReviewerDirectoryList((prev) =>
      prev.map((r) => (r.id === reviewerId ? { ...r, ...patch } : r))
    );
    syncToServer(api.patch(`/reviewer-directory/${reviewerId}`, patch), onSyncError('Reviewer directory'));
    addToast(
      language === 'bn' ? 'ব্র্যান্ড অ্যাম্বাসেডর স্ট্যাটাস পরিবর্তন' : 'Ambassador Status Toggled',
      'Reviewer ambassador privileges updated.',
      'success'
    );
  };

  // Product Catalog Admin Actions
  const adminApproveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'approved' } : p))
    );
    syncToServer(api.patch(`/products/${productId}`, { approvalStatus: 'approved' }), onSyncError('Product'));
    addToast(
      language === 'bn' ? 'পণ্য ক্যাম্পেইনের জন্য অনুমোদিত! 📦' : 'Product Approved! 📦',
      'Product is verified for testing campaigns.',
      'success'
    );
    triggerConfetti();
  };

  const adminRequestProductChanges = (productId: string, note: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approvalStatus: 'revision_requested' } : p))
    );
    syncToServer(api.patch(`/products/${productId}`, { approvalStatus: 'revision_requested' }), onSyncError('Product'));
    addToast(
      language === 'bn' ? 'পণ্যে সংশোধন প্রয়োজন' : 'Product Revision Requested',
      note,
      'warning'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    syncToServer(api.patch(`/notifications/${id}`, { isRead: true }), onSyncError('Notification'));
  };

  const markAllNotificationsAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    unreadIds.forEach((id) => {
      syncToServer(api.patch(`/notifications/${id}`, { isRead: true }), onSyncError('Notification'));
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        toggleLanguage,
        activeReviewerTab,
        setActiveReviewerTab,
        activeBrandTab,
        setActiveBrandTab,
        activeAdminTab,
        setActiveAdminTab,
        toasts,
        addToast,
        removeToast,
        triggerConfetti,
        reviewerProfile,
        updateReviewerProfile,
        submitOnboardingStep,
        submitDemoReview,
        // Brand & Multi-Store
        brandProfile,
        updateBrandProfile,
        stores,
        activeStoreId,
        setActiveStoreId,
        activeStore,
        businessOwners,
        addStore,
        updateStore,
        adminApproveStore,
        adminRequestStoreChanges,
        adminSuspendStore,

        // Logistics & Deliveries
        deliveries,
        returnBookings,
        createDeliveryShipment,
        advanceDeliverySimulationStep,
        advanceReturnSimulationStep,
        confirmReturnInspection,

        // Reviewer Directory & Management
        reviewerDirectoryList,
        adminVerifyReviewerNid,
        adminUpdateReviewerStatus,
        adminAdjustTrustScore,
        adminToggleAmbassadorStatus,

        // Products & Catalog
        products,
        addProduct,
        adminApproveProduct,
        adminRequestProductChanges,
        campaigns,
        addCampaign,
        assignments,
        applyToCampaign,
        confirmProductReceipt,
        reportDamagedProduct,
        startProductTesting,
        submitAssignmentReview,
        requestAssignmentRevision,
        approveAssignmentSubmission,
        confirmReturnShipped,
        confirmReturnReceived,
        rewards,
        redemptions,
        redeemReward,
        transactions,
        withdrawals,
        requestWithdrawal,
        ambassadorContracts,
        disputes,
        createDispute,
        addDisputeMessage,
        resolveDispute,
        riskFlags,
        resolveRiskFlag,
        automations,
        toggleAutomationRule,
        triggerAutomationTest,
        auditLogs,
        adminApproveReviewer,
        adminRateDemoVideo,
        adminApproveBrand,
        adminApproveCampaign,
        adminProcessWithdrawal,
        leaderboard,
        trainingModules,
        completeTrainingModule,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
