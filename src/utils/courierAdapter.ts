import { CourierProviderId, Delivery, DeliveryStatus, CourierTrackingEvent, ReturnBooking, ReturnStatus } from '../types';

export interface CourierProviderMeta {
  id: CourierProviderId;
  nameBn: string;
  nameEn: string;
  logo: string;
  badgeColor: string;
  supportedServices: string[];
  baseCostInsideDhakaBdt: number;
  baseCostOutsideDhakaBdt: number;
  estimatedHoursInsideDhaka: number;
  estimatedHoursOutsideDhaka: number;
  supportsRealtimeWebhook: boolean;
  supportsReturnPickup: boolean;
}

export const COURIER_PROVIDERS: Record<CourierProviderId, CourierProviderMeta> = {
  steadfast: {
    id: 'steadfast',
    nameBn: 'স্টেডফাস্ট কুরিয়ার বিডি',
    nameEn: 'Steadfast Courier BD',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'emerald',
    supportedServices: ['Same Day Dhaka', 'Next Day Sub-Dhaka', '48-72h Nationwide', 'Doorstep Return'],
    baseCostInsideDhakaBdt: 70,
    baseCostOutsideDhakaBdt: 130,
    estimatedHoursInsideDhaka: 24,
    estimatedHoursOutsideDhaka: 48,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
  pathao: {
    id: 'pathao',
    nameBn: 'পাঠাও লজিস্টিকস',
    nameEn: 'Pathao Logistics Express',
    logo: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'rose',
    supportedServices: ['Express 6h Dhaka', 'Next Day Express', 'OTP Secure Delivery', 'Reverse Logistics'],
    baseCostInsideDhakaBdt: 85,
    baseCostOutsideDhakaBdt: 145,
    estimatedHoursInsideDhaka: 12,
    estimatedHoursOutsideDhaka: 36,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
  redx: {
    id: 'redx',
    nameBn: 'রেডএক্স ডেলিভারি',
    nameEn: 'RedX Nationwide Delivery',
    logo: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'red',
    supportedServices: ['Doorstep Delivery', 'Fragile Protection', 'Reverse Return Handling'],
    baseCostInsideDhakaBdt: 75,
    baseCostOutsideDhakaBdt: 135,
    estimatedHoursInsideDhaka: 24,
    estimatedHoursOutsideDhaka: 60,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
  paperfly: {
    id: 'paperfly',
    nameBn: 'পেপারফ্লাই স্মার্ট লজিস্টিকস',
    nameEn: 'Paperfly Smart Logistics',
    logo: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'blue',
    supportedServices: ['Doorstep Delivery to 64 Districts', 'Fragile Goods Packaging'],
    baseCostInsideDhakaBdt: 70,
    baseCostOutsideDhakaBdt: 120,
    estimatedHoursInsideDhaka: 24,
    estimatedHoursOutsideDhaka: 72,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
  sundarban: {
    id: 'sundarban',
    nameBn: 'সুন্দরবন কুরিয়ার সার্ভিস',
    nameEn: 'Sundarban Courier Service',
    logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'amber',
    supportedServices: ['Hub-to-Hub', 'Branch Collection', 'Heavy Parcel Cargo'],
    baseCostInsideDhakaBdt: 60,
    baseCostOutsideDhakaBdt: 110,
    estimatedHoursInsideDhaka: 24,
    estimatedHoursOutsideDhaka: 48,
    supportsRealtimeWebhook: false,
    supportsReturnPickup: false,
  },
  bringdollar_express: {
    id: 'bringdollar_express',
    nameBn: 'ব্রিংডলার ভেরিফাইড এক্সপ্রেস',
    nameEn: 'BringDollar Verified Express',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'cyan',
    supportedServices: ['Reviewer Priority Transit', 'Tamper-Proof Box', 'Live Unboxing Witness'],
    baseCostInsideDhakaBdt: 100,
    baseCostOutsideDhakaBdt: 160,
    estimatedHoursInsideDhaka: 18,
    estimatedHoursOutsideDhaka: 36,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
  demo_courier: {
    id: 'demo_courier',
    nameBn: 'ডেমো সিমুলেশন কুরিয়ার',
    nameEn: 'Demo Interactive Courier',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    badgeColor: 'purple',
    supportedServices: ['Instant Status Progression', 'Sandbox Simulation'],
    baseCostInsideDhakaBdt: 0,
    baseCostOutsideDhakaBdt: 0,
    estimatedHoursInsideDhaka: 1,
    estimatedHoursOutsideDhaka: 2,
    supportsRealtimeWebhook: true,
    supportsReturnPickup: true,
  },
};

/**
 * Generate a unique tracking code based on courier provider
 */
export function generateTrackingId(provider: CourierProviderId): string {
  const prefixMap: Record<CourierProviderId, string> = {
    steadfast: 'ST',
    pathao: 'PTH',
    redx: 'RDX',
    paperfly: 'PFLY',
    sundarban: 'SCS',
    bringdollar_express: 'BD-EXP',
    demo_courier: 'DEMO',
  };
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefixMap[provider]}-${randomNum}`;
}

/**
 * Simulate live step forward for a delivery
 */
export function getNextDeliveryStatus(currentStatus: DeliveryStatus): { nextStatus: DeliveryStatus; eventDescription: string; location: string } {
  switch (currentStatus) {
    case 'draft':
    case 'booking_pending':
      return {
        nextStatus: 'booking_confirmed',
        eventDescription: 'Booking confirmed by courier hub. Parcel ID generated.',
        location: 'Merchant Warehouse / Store Depot',
      };
    case 'booking_confirmed':
      return {
        nextStatus: 'pickup_requested',
        eventDescription: 'Pickup rider assigned. Rider en-route to pickup merchant parcel.',
        location: 'Local Merchant Hub',
      };
    case 'pickup_requested':
      return {
        nextStatus: 'picked_up',
        eventDescription: 'Parcel collected from merchant warehouse. Scanned at Sorting Hub.',
        location: 'Dhaka Central Sorting Gateway',
      };
    case 'picked_up':
      return {
        nextStatus: 'in_transit',
        eventDescription: 'Parcel dispatched to destination district delivery hub.',
        location: 'Regional Logistics Hub',
      };
    case 'in_transit':
      return {
        nextStatus: 'out_for_delivery',
        eventDescription: 'Out for delivery. Courier rider has received package for final doorstep dispatch.',
        location: 'Destination Thana Hub',
      };
    case 'out_for_delivery':
      return {
        nextStatus: 'delivered',
        eventDescription: 'Delivered successfully to verified reviewer.',
        location: 'Reviewer Delivery Address',
      };
    case 'delivery_failed':
      return {
        nextStatus: 'rescheduled',
        eventDescription: 'Delivery attempt rescheduled for next business morning.',
        location: 'Destination Hub',
      };
    case 'rescheduled':
      return {
        nextStatus: 'out_for_delivery',
        eventDescription: 'Out for delivery (2nd attempt).',
        location: 'Destination Hub',
      };
    default:
      return {
        nextStatus: currentStatus,
        eventDescription: 'Status refreshed.',
        location: 'Hub',
      };
  }
}

/**
 * Simulate live step forward for a return booking
 */
export function getNextReturnStatus(currentStatus: ReturnStatus): { nextStatus: ReturnStatus; eventDescription: string } {
  switch (currentStatus) {
    case 'return_required':
    case 'pickup_pending':
      return {
        nextStatus: 'picked_up',
        eventDescription: 'Reverse pickup rider collected parcel from reviewer with safe packaging seal.',
      };
    case 'picked_up':
      return {
        nextStatus: 'in_transit',
        eventDescription: 'Return parcel in transit back to brand warehouse.',
      };
    case 'in_transit':
      return {
        nextStatus: 'delivered_to_brand',
        eventDescription: 'Delivered to Brand Return Department. Pending product physical inspection.',
      };
    case 'delivered_to_brand':
      return {
        nextStatus: 'condition_review',
        eventDescription: 'Brand team inspecting product condition and original packaging.',
      };
    case 'condition_review':
      return {
        nextStatus: 'return_completed',
        eventDescription: 'Brand confirmed product condition in good order. Return workflow completed.',
      };
    default:
      return {
        nextStatus: currentStatus,
        eventDescription: 'Return status refreshed.',
      };
  }
}
