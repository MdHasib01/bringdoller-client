// BringDollar Type Definitions

export type UserRole = 'guest' | 'reviewer' | 'brand' | 'admin';

export type Language = 'bn' | 'en';

export type ReviewerTab = 
  | 'home'
  | 'opportunities'
  | 'tasks'
  | 'wallet'
  | 'rewards'
  | 'leaderboard'
  | 'academy'
  | 'profile';

export type VerificationStatus = 
  | 'not_submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'resubmission_required';

export type ReviewerAccountStatus = 
  | 'application_pending'
  | 'verification_pending'
  | 'verified'
  | 'active'
  | 'temporarily_restricted'
  | 'suspended'
  | 'rejected'
  | 'deactivated';

export type OwnerAccountStatus = 
  | 'active' 
  | 'under_review' 
  | 'restricted' 
  | 'suspended' 
  | 'deactivated';

export type StoreStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_admin_review' 
  | 'changes_requested' 
  | 'approved' 
  | 'rejected' 
  | 'suspended' 
  | 'archived';

export type StoreRole = 
  | 'owner' 
  | 'store_admin' 
  | 'campaign_manager' 
  | 'product_manager' 
  | 'logistics_manager' 
  | 'finance_manager' 
  | 'review_manager' 
  | 'viewer';

export type CourierProviderId = 
  | 'steadfast' 
  | 'pathao' 
  | 'redx' 
  | 'paperfly' 
  | 'sundarban' 
  | 'bringdollar_express' 
  | 'demo_courier';

export type DeliveryStatus = 
  | 'draft' 
  | 'booking_pending' 
  | 'booking_confirmed' 
  | 'pickup_requested' 
  | 'picked_up' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'delivery_failed' 
  | 'rescheduled' 
  | 'cancelled' 
  | 'return_to_origin' 
  | 'return_pending' 
  | 'returned';

export type ReturnStatus = 
  | 'not_required' 
  | 'return_required' 
  | 'pickup_pending' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered_to_brand' 
  | 'condition_review' 
  | 'return_completed' 
  | 'return_disputed' 
  | 'return_overdue';

export type ProductApprovalStatus = 
  | 'approved' 
  | 'pending' 
  | 'changes_requested' 
  | 'suspended' 
  | 'archived';

export interface BusinessOwner {
  id: string; // e.g. 'owner-1'
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isNidVerified: boolean;
  nidMasked: string;
  nidFrontUrl?: string;
  nidBackUrl?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  businessAddress: string;
  district: string;
  tradeLicenseNumber?: string;
  tradeLicenseUrl?: string;
  ownershipDeclarationSigned: boolean;
  maxAllowedStores: number;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  verificationNotes?: string;
  storeIds: string[];
  totalCampaignSpendingBdt: number;
  activeCampaignsCount: number;
  totalProductsCount: number;
  accountStatus: OwnerAccountStatus;
  joinedDate: string;
}

export interface OwnerVerification {
  id: string;
  ownerId: string;
  ownerName: string;
  nidMasked: string;
  nidFrontUrl: string;
  nidBackUrl: string;
  tradeLicenseNumber?: string;
  tradeLicenseUrl?: string;
  ownershipDeclarationSigned: boolean;
  status: VerificationStatus;
  submittedAt: string;
  verifiedAt?: string;
  reviewedByAdminId?: string;
  adminNotes?: string;
}

export interface StoreTeamMember {
  id: string;
  storeId?: string;
  userId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role: StoreRole;
  status: 'active' | 'invited' | 'disabled';
  addedAt?: string;
  joinedAt?: string;
  lastActive?: string;
}

export interface Store {
  id: string; // e.g. 'store-1'
  ownerId: string;
  ownerName: string;
  storeName?: string;
  name?: string; // alias for storeName
  brandName?: string;
  storeLogoUrl?: string;
  logoUrl?: string; // alias for storeLogoUrl
  businessCategory?: string;
  category?: string; // alias for businessCategory
  storeDescription?: string;
  description?: string; // alias for storeDescription
  tagline?: string;
  businessAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  tradeLicenseNumber?: string;
  tradeLicenseUrl?: string;
  supportingDocs?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  billingDetails?: {
    tinMasked?: string;
    billingName: string;
    billingAddress: string;
  };
  returnAddress?: any;
  defaultPickupAddress?: string;
  pickupAddress?: any;
  verificationStatus: StoreStatus;
  rejectionReason?: string;
  suspensionReason?: string;
  changesRequestedNote?: string;
  productCount?: number;
  totalProductsCount?: number;
  activeCampaignsCount?: number;
  assignedReviewersCount?: number;
  totalReviewersHired?: number;
  completedReviewsCount?: number;
  pendingDeliveriesCount?: number;
  openDisputesCount?: number;
  escrowBalanceBdt?: number;
  totalSpentBdt?: number;
  deliverySuccessRate?: number; // e.g. 98%
  reviewCompletionRate?: number; // e.g. 95%
  createdAt: string;
  updatedAt?: string;
  teamMembers: StoreTeamMember[];
}

export interface CourierTrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  title?: string;
  description: string;
  by?: string;
}

export interface ReturnBooking {
  id: string;
  deliveryId: string;
  trackingId: string;
  assignmentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoneMasked?: string;
  storeId?: string;
  storeName?: string;
  brandName?: string;
  courierProvider?: CourierProviderId;
  courierName?: string;
  pickupAddress?: string;
  returnAddress?: string;
  returnReason?: string;
  productCondition?: 'unopened' | 'lightly_used' | 'scratched' | 'damaged' | 'working_perfect';
  includedAccessories?: string[];
  returnDeadline?: string;
  proofImages?: string[];
  status?: ReturnStatus;
  receivedAtBrandWarehouse?: string;
  events?: any[];
  brandConfirmedCondition?: boolean;
  brandReceiptNotes?: string;
  returnChargeBdt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Delivery {
  id: string;
  trackingId: string;
  assignmentId: string;
  campaignId: string;
  campaignTitle: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  productVariant?: string;
  productQuantity?: number;
  storeId?: string;
  storeName?: string;
  brandName?: string;
  ownerId?: string;
  ownerName?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoneMasked?: string;
  reviewerPhone?: string;
  reviewerAddress?: any;
  deliveryAddress?: {
    recipientName: string;
    phone: string;
    fullAddress: string;
    district: string;
    thana?: string;
    area?: string;
  };
  pickupAddress?: any;
  courierProvider?: CourierProviderId;
  courierName?: string;
  deliveryType?: 'standard' | 'express' | 'fragile';
  parcelWeightKg?: number;
  parcelDimensions?: string;
  specialInstructions?: string;
  isReturnRequired?: boolean;
  isReturnable?: boolean;
  returnDeadline?: string;
  currentStatus?: DeliveryStatus;
  status?: DeliveryStatus;
  dispatchDate?: string;
  dispatchedAt?: string;
  estimatedDeliveryDate?: string;
  deliveredDate?: string;
  deliveredAt?: string;
  deliveryChargeBdt?: number;
  costBearer?: 'brand_pays' | 'campaign_budget' | 'brand_escrow' | 'bringdollar_promo';
  courierTrackingEvents?: CourierTrackingEvent[];
  events?: any[];
  notes?: string;
  shippingLabelUrl?: string;
  deliveryProofUrl?: string;
  failedReason?: string;
  damageReport?: {
    reportedAt: string;
    reason: string;
    photos: string[];
    status: 'under_review' | 'accepted' | 'rejected';
  };
  returnBooking?: ReturnBooking;
  riskFlag?: boolean;
  riskNotes?: string;
  auditLogs?: Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export type CampaignStatus = 
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type AssignmentStatus = 
  | 'assigned'
  | 'accepted'
  | 'product_preparing'
  | 'product_dispatched'
  | 'product_received'
  | 'testing_started'
  | 'submission_due'
  | 'submitted'
  | 'under_quality_review'
  | 'revision_requested'
  | 'approved'
  | 'payment_released'
  | 'return_pending'
  | 'return_completed'
  | 'closed';

export type ReviewerLevelId = 
  | 'starter'
  | 'verified'
  | 'trusted_voice'
  | 'pro'
  | 'elite'
  | 'brand_choice'
  | 'brand_ambassador';

export interface ReviewerLevel {
  id: ReviewerLevelId;
  nameBn: string;
  nameEn: string;
  minXp: number;
  badgeIcon: string;
  color: string;
  perksBn: string[];
  perksEn: string[];
  maxTaskPayoutBdt: number;
  priorityAccess: boolean;
  ambassadorEligible: boolean;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface ProductDetails {
  productName: string;
  brandName?: string;
  category?: string;
  subcategory?: string;
  images: string[];
  description: string;
  purpose: string;
  specifications: string;
  keyFeatures: string[];
  ingredientsOrMaterials?: string;
  sizeOrQuantity: string;
  variants?: string[];
  usageInstructions: string[];
  recommendedUsagePeriodDays?: number;
  safetyInstructions: string;
  storageInstructions: string;
  intendedUsers: string;
  usersWhoShouldAvoid: string;
  supportedClaims?: string[];
  priceBdt: number;
  websiteUrl?: string;
  customerSupportContact?: {
    email?: string;
    phone?: string;
    supportUrl?: string;
  };
  supportingDocuments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface CampaignDoItem {
  id: string;
  text: string;
  description?: string;
  isMandatory: boolean;
  example?: string;
  order: number;
}

export interface CampaignDontItem {
  id: string;
  text: string;
  description?: string;
  isMandatory: boolean;
  example?: string;
  order: number;
}

export interface ReviewerProfile {
  id: string;
  userId: string;
  reviewerId?: string; // e.g. 'BD-REV-84920'
  fullName: string;
  displayName: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  presentAddress: string;
  district: string;
  avatarUrl: string;
  preferredLanguage: 'bn' | 'en' | 'both';
  
  // Verification
  nidNumberMasked: string;
  nidFrontUrl?: string;
  nidBackUrl?: string;
  selfieUrl?: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verificationDate?: string;
  
  // Reviewer Details
  contentInterests: string[];
  productCategories: string[];
  spokenLanguages: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  deviceInfo?: {
    primaryPhone: string;
    cameraQuality: string;
    hasMic: boolean;
    hasRingLight: boolean;
  };
  preferredReviewFormat?: 'video' | 'short_video' | 'unboxing_test' | 'written_with_shots';
  deliveryAddress?: {
    recipientName: string;
    phone: string;
    fullAddress: string;
    district: string;
    thana?: string;
  };
  payoutMethod?: {
    type: 'bkash' | 'nagad' | 'bank';
    accountNumber: string;
    bankName?: string;
    branchName?: string;
  };
  
  // Demo Review
  demoSubmission?: DemoSubmission;
  
  // Admin Directory & Multi-Store Enrichment
  accountStatus?: ReviewerAccountStatus;
  assignedBrands?: string[];
  assignedProducts?: string[];
  assignedStores?: string[];
  currentCampaignTitle?: string;
  currentDeliveryStatus?: DeliveryStatus;
  currentSubmissionStatus?: string;
  totalEarningsBdt?: number;
  lastActiveDate?: string;
  conflictLocks?: Array<{ id: string; category: string; brandName: string; expiresAt: string; reason: string }>;
  riskFlagsList?: Array<{ id: string; type: string; severity: 'low' | 'medium' | 'high' | 'critical'; date: string; status: string; notes: string }>;
  auditLogsList?: Array<{ id: string; timestamp: string; actor: string; action: string; note: string }>;

  // Career & Economy Stats
  careerXp: number; // Permanent, never decreases
  rewardCoins: number; // Spendable, decreases on redemption
  levelId: ReviewerLevelId;
  trustScore: number; // 0 to 100
  
  // Performance
  tasksCompleted: number;
  onTimeRate: number; // Percentage
  approvalRate: number; // Percentage
  averageRating: number; // Out of 5.0
  activeAssignmentsCount: number;
  profileCompletionPercentage?: number;
  
  // Ambassador Status
  isAmbassador?: boolean;
  activeAmbassadorContracts?: number;
  
  // Application flow state
  onboardingStep?: number; // 1 to 5
  isApplicationApproved?: boolean;

  // Extended Profile Modules
  careerXpHistory?: Array<{
    id: string;
    date: string;
    amount: number;
    reason: string;
    category: string;
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    category: string;
  }>;
  certificates?: Array<{
    id: string;
    title: string;
    issueDate: string;
    issuer: string;
    badgeUrl?: string;
    verifyUrl?: string;
  }>;
  deviceAndCamera?: {
    phoneModel: string;
    cameraResolution: string;
    micType: string;
    lighting: string;
    tripod: boolean;
  };
  trustScoreBreakdown?: {
    authenticity: number;
    timeliness: number;
    videoQa: number;
    policyCompliance: number;
    returnRecord: number;
  };
  productReturnRecord?: {
    totalReturnableTasks: number;
    successfullyReturned: number;
    damagedOrLate: number;
    returnRatePercent: number;
  };
  nidVerificationData?: {
    nidMasked: string;
    isVerified: boolean;
    verificationMethod: string;
    verifiedAt: string;
  };
  demoReviewData?: {
    passed: boolean;
    score: number;
    completedDate: string;
    evaluatorNotes: string;
  };
  taxAndBilling?: {
    eTinMasked: string;
    isVatExempt: boolean;
    billingName: string;
    billingAddress: string;
  };
  appPreferences?: {
    language: 'en' | 'bn';
    notifications: { push: boolean; email: boolean; sms: boolean; campaignAlerts: boolean };
    whatsapp: { enabled: boolean; instantAlerts: boolean; courierTracking: boolean };
    voiceCall: { allowLogisticsCalls: boolean; preferredTime: string };
    appearance: 'dark' | 'dim' | 'system';
    privacy: { publicProfile: boolean; anonymousPublicReviews: boolean };
    security: { twoFactorEnabled: boolean; biometricUnlock: boolean };
    activeDevices: Array<{ deviceName: string; location: string; lastActive: string; isCurrent: boolean }>;
  };
  supportTickets?: Array<{
    id: string;
    subject: string;
    category: string;
    status: 'open' | 'in_progress' | 'resolved';
    createdAt: string;
    lastUpdate: string;
    messages: Array<{ sender: string; text: string; time: string }>;
  }>;
}

export interface DemoSubmission {
  id: string;
  reviewerId: string;
  productType: string;
  videoUrl: string;
  videoDurationSeconds: number;
  submittedAt: string;
  notes: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'resubmit_required';
  adminFeedback?: string;
  rubricScores?: {
    naturalDelivery: number; // 1-5
    authenticityBalance: number; // 1-5
    audioClarity: number; // 1-5
    videoClarity: number; // 1-5
    communication: number; // 1-5
    productExplanation: number; // 1-5
    limitationsMentioned: number; // 1-5
    overallSuitability: number; // 1-5
  };
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface BrandProfile {
  id: string;
  userId: string;
  companyName: string;
  brandName: string;
  businessType: string;
  contactPerson: string;
  phone: string;
  email: string;
  tradeLicenseNumber: string;
  tradeLicenseUrl?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  billingAddress: string;
  brandLogoUrl: string;
  brandDescription: string;
  productCategories: string[];
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  
  // Financial
  escrowBalanceBdt: number;
  totalSpentBdt: number;
  activeCampaignsCount: number;
  completedCampaignsCount: number;
  totalReviewsGenerated: number;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string;
  storeId?: string;
  storeName?: string;
  ownerId?: string;
  ownerName?: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  ingredientsOrSpecs: string;
  images: string[];
  retailPriceBdt: number;
  testingInstructions: string;
  safetyInstructions: string;
  supportedClaims: string[];
  prohibitedClaims: string[];
  requiredTestingDurationDays: number;
  isReturnable: boolean;
  competitorGroup: string;
  productFamily: string;
  approvalStatus?: ProductApprovalStatus;
  approvalHistory?: Array<{ date: string; action: string; admin: string; notes?: string }>;
  assignedReviewersCount?: number;
  activeCampaignsCount?: number;
  productPurpose?: string;
  keyFeatures?: string[];
  sizeOrQuantity?: string;
  variants?: string[];
  usageInstructions?: string[];
  storageInstructions?: string;
  intendedUsers?: string;
  usersWhoShouldAvoid?: string;
  websiteUrl?: string;
  returnPolicy?: string;
  supportingDocuments?: Array<{ name: string; url: string; type: string }>;
  createdAt: string;
}

export interface CampaignBrief {
  version?: number; // e.g. 1.0, 1.1
  briefVersion?: string; // e.g. "v1.0"
  lastUpdated?: string;
  objective: string;
  honestReviewGuidelinesBn: string;
  honestReviewGuidelinesEn: string;
  mandatoryTalkingPoints: string[];
  optionalTalkingPoints?: string[];
  genuineAdvantagesToAssess?: string[];
  possibleLimitationsToAssess?: string[];
  supportedClaims?: string[];
  prohibitedClaims: string[];
  requiredShots: string[];
  videoOrientation: 'vertical' | 'horizontal' | 'any';
  minDurationSeconds: number;
  maxDurationSeconds: number;
  testingDurationDays: number;
  disclosureRequirement: string;
  returnPolicy?: string;
  productDetails?: ProductDetails;
  dos?: CampaignDoItem[];
  donts?: CampaignDontItem[];
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string;
  storeId?: string;
  storeName?: string;
  ownerId?: string;
  ownerName?: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  productRetailPriceBdt: number;
  
  title: string;
  category: string;
  status: CampaignStatus;
  
  reviewerRewardBdt: number;
  careerXpReward: number;
  rewardCoinsReward: number;
  
  totalReviewersTarget: number;
  reviewersHired: number;
  submissionsApproved: number;
  
  brief: CampaignBrief;
  productDetails?: ProductDetails;
  adminApprovalStatus?: 'approved' | 'pending' | 'revision_requested';
  adminFeedback?: string;
  
  targetLocationDistrict?: string;
  minReviewerLevel: ReviewerLevelId;
  minTrustScore: number;
  preferredLanguage: 'bn' | 'en' | 'any';
  
  isReturnRequired: boolean;
  returnShippingCoveredByBrand: boolean;
  
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  
  // Budget breakdown
  budget: {
    reviewerPayoutTotalBdt: number;
    platformFeeBdt: number;
    logisticsFeeBdt: number;
    taxBdt: number;
    grandTotalBdt: number;
    escrowFunded: boolean;
  };
  
  createdAt: string;
}

export interface Assignment {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string;
  storeId?: string;
  storeName?: string;
  ownerId?: string;
  ownerName?: string;
  deliveryId?: string;
  deliveryStatus?: DeliveryStatus;
  returnBookingId?: string;
  returnStatus?: ReturnStatus;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  reviewerTrustScore: number;
  productId: string;
  productName: string;
  productImageUrl: string;
  
  status: AssignmentStatus;
  payoutBdt: number;
  careerXp: number;
  rewardCoins: number;
  isReturnRequired: boolean;
  
  assignedAt: string;
  acceptedAt?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  testingStartedAt?: string;
  submissionDeadline: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  returnCompletedAt?: string;

  // Reviewer Brief Acknowledgement & Version tracking
  briefVersionAccepted?: string; // e.g. "v1.0"
  acknowledgedAt?: string;
  acceptedTermsStatement?: string;
  readMandatoryDos?: string[];
  readMandatoryDonts?: string[];
  hasReadProductDetails?: boolean;
  hasReadDosAndDonts?: boolean;
  acknowledgementSessionInfo?: {
    device: string;
    browser: string;
    location: string;
    ipMasked: string;
  };
  briefUpdatedAlert?: {
    oldVersion: string;
    newVersion: string;
    changedInstructions: string[];
    isReacknowledged: boolean;
  };
  
  // Shipping info
  shipment?: {
    courierName: string;
    trackingId: string;
    dispatchDate: string;
    deliveryDate?: string;
    receivedConfirmed: boolean;
    damagedReported?: boolean;
    damageReportReason?: string;
  };
  
  // Return info
  returnShipment?: {
    courierName: string;
    trackingId: string;
    returnDeadline: string;
    returnReceivedDate?: string;
    isReturnReceived: boolean;
  };
  
  // Submission data
  submission?: Submission;
  
  // Revision requests
  revisions: {
    id: string;
    requestedAt: string;
    requestedBy: 'brand' | 'admin';
    reasonCategory: 'factual_error' | 'missing_mandatory_shot' | 'audio_video_quality' | 'policy_violation';
    feedbackDetails: string;
    timestampMarkers?: string[];
    isResolved: boolean;
    resolvedAt?: string;
  }[];
  
  // Ratings
  adminQualityRating?: QualityRating;
}

export interface Submission {
  id: string;
  assignmentId: string;
  version: number;
  videoUrl: string;
  videoDurationSeconds: number;
  thumbnailUrl?: string;
  writtenReviewSummary: string;
  honestPros: string[];
  honestCons: string[];
  overallRatingGiven: number; // 1-5 product rating
  disclosureIncluded: boolean;
  submittedAt: string;
  notesToBrand?: string;
  editHistory: {
    version: number;
    submittedAt: string;
    videoUrl: string;
    changesNote: string;
  }[];
}

export interface QualityRating {
  id: string;
  assignmentId: string;
  reviewerId: string;
  ratedByAdminId: string;
  ratedByName: string;
  ratedAt: string;
  scores: {
    authenticity: number; // 1-5
    communication: number; // 1-5
    videoQuality: number; // 1-5
    audioQuality: number; // 1-5
    briefCompliance: number; // 1-5
    timeliness: number; // 1-5
    productDemonstration: number; // 1-5
    overallUsefulness: number; // 1-5
  };
  totalAverageScore: number;
  publicNotes: string;
  internalNotes: string;
}

export interface RewardItem {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  category: 'gadget' | 'audio' | 'camera_gear' | 'voucher' | 'training' | 'merch';
  imageUrl: string;
  coinsCost: number;
  stock: number;
  minLevelRequired: ReviewerLevelId;
  estimatedDeliveryDays: number;
  isPopular?: boolean;
}

export interface RewardRedemption {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rewardItemId: string;
  rewardTitleBn: string;
  rewardTitleEn: string;
  coinsSpent: number;
  status: 'requested' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  recipientPhone: string;
  trackingNumber?: string;
  courierName?: string;
  requestedAt: string;
  deliveredAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  reviewerId: string;
  displayName: string;
  avatarUrl: string;
  district: string;
  category: string;
  careerXp: number;
  levelId: ReviewerLevelId;
  tasksCompleted: number;
  trustScore: number;
  rank: number;
  badge?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'task_earning' | 'ambassador_payout' | 'withdrawal' | 'bonus_xp' | 'coin_spend' | 'escrow_deposit' | 'escrow_release';
  amountBdt: number;
  coinsDelta?: number;
  xpDelta?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  descriptionBn: string;
  descriptionEn: string;
  referenceId?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  reviewerId: string;
  reviewerName: string;
  amountBdt: number;
  method: 'bkash' | 'nagad' | 'bank';
  accountNumberMasked: string;
  bankDetails?: {
    bankName: string;
    branchName: string;
    accountHolder: string;
  };
  status: 'requested' | 'under_review' | 'processing' | 'paid' | 'failed' | 'rejected';
  transactionId?: string;
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface BrandAmbassadorContract {
  id: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  contractValueBdt: number; // e.g. Up to ৳100,000
  durationMonths: number;
  monthlyDeliverables: string[];
  exclusivityCategory: string;
  status: 'invited' | 'negotiating' | 'active' | 'completed' | 'declined' | 'terminated';
  paymentScheduleBn: string;
  paymentScheduleEn: string;
  termsBn: string;
  termsEn: string;
  invitedAt: string;
  acceptedAt?: string;
}

export interface Dispute {
  id: string;
  assignmentId: string;
  campaignTitle: string;
  raisedByRole: 'reviewer' | 'brand';
  raisedById: string;
  raisedByName: string;
  counterPartyName: string;
  reason: 
    | 'product_not_received'
    | 'wrong_damaged_product'
    | 'unclear_brief'
    | 'unfair_revision_request'
    | 'missed_deadline'
    | 'product_return_issue'
    | 'payment_delay'
    | 'authenticity_concern';
  description: string;
  evidenceUrls: string[];
  status: 'open' | 'under_investigation' | 'arbitration_decision' | 'resolved' | 'appealed' | 'closed';
  messages: {
    id: string;
    senderRole: 'reviewer' | 'brand' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
  adminDecision?: {
    resolutionSummary: string;
    fundsAction: 'release_to_reviewer' | 'refund_to_brand' | 'split_payout';
    reviewerPayoutBdt?: number;
    brandRefundBdt?: number;
    decidedByAdminName: string;
    decidedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RiskFlag {
  id: string;
  userId: string;
  userName: string;
  userRole: 'reviewer' | 'brand';
  riskType: 
    | 'duplicate_nid'
    | 'duplicate_face'
    | 'multi_account_device'
    | 'reused_video_asset'
    | 'suspicious_metadata'
    | 'ai_generated_suspicion'
    | 'fake_delivery_confirmation'
    | 'repeated_late_return'
    | 'unusual_rating_behavior'
    | 'collusion_suspicion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  status: 'pending_review' | 'investigating' | 'dismissed' | 'warning_issued' | 'restricted';
  flaggedAt: string;
  reviewedByAdmin?: string;
  resolutionNote?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  recipientRole: UserRole;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  type: 'opportunity' | 'assignment' | 'payment' | 'level_up' | 'revision' | 'ambassador' | 'system';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  conditionDescription: string;
  actionType: 'send_whatsapp' | 'send_push' | 'make_voice_call' | 'create_risk_alert' | 'release_escrow';
  channelTemplate: string;
  isEnabled: boolean;
  executionsCount: number;
  lastTriggeredAt?: string;
}

export interface TrainingModule {
  id: string;
  titleBn: string;
  titleEn: string;
  category: string;
  durationMinutes: number;
  xpReward: number;
  badgeReward?: string;
  isCompleted: boolean;
  summaryBn: string;
  summaryEn: string;
  lessons: {
    titleBn: string;
    titleEn: string;
    contentBn: string;
    contentEn: string;
    keyTakeawaysBn: string[];
    keyTakeawaysEn: string[];
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  ipAddress: string;
  details: string;
}
