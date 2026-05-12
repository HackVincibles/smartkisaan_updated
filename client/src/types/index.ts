export type Role = 'farmer' | 'buyer' | 'transport' | 'admin';

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: Role;
  isBanned?: boolean;
  banExpiresAt?: string;
  fakeDisputeCount?: number;
}

export interface Listing {
  _id: string;
  farmerId: string;
  cropName: string;
  quantity: number;
  unit: string;
  basePrice: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  harvestDate: string;
  images: string[];
  aiGrade?: string;
  aiScore?: number;
  status: 'available' | 'sold' | 'expired';
  createdAt: string;
}

export interface Bid {
  _id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Order {
  _id: string;
  listingId: string;
  farmerId: string;
  buyerId: string;
  agencyId?: string;
  agreedPrice: number;
  quantity: number;
  escrowState: 'BID_PLACED' | 'PENDING_PAYMENT' | 'PAID_ESCROW' | 'PICKUP_ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'DISPUTED' | 'COMPLETED' | 'REFUNDED' | 'CANCELLED';
  deliveredQuantity?: number;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface AIScan {
  _id: string;
  orderId?: string;
  listingId?: string;
  scanType: 'LISTING' | 'PICKUP' | 'DELIVERY';
  aiGrade: string;
  aiScore: number;
  matchScore?: number;
  qualityRatio?: number;
  scannedBy: string;
  images: string[];
  blockchainTxHash?: string;
  createdAt: string;
}

export interface Dispute {
  _id: string;
  orderId: string;
  raisedBy: string;
  reason: string;
  verdict?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export interface GroupCluster {
  clusterId: string;
  members: Listing[];
  center: {
    lat: number;
    lng: number;
  };
}
