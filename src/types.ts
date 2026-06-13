// ========== Core Domain Types ==========

export type CategoryId = 'cleaning' | 'repair' | 'moving' | 'cooking';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface Aunt {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  orderCount: number;
  bio: string;
  specialties: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface Service {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  aunt: Aunt;
  items: ServiceItem[];
  priceDetails: { label: string; amount: number }[];
}

export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  label: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  auntId: string;
  auntName: string;
  auntAvatar: string;
  date: string;
  timeSlot: string;
  address: string;
  contactName: string;
  contactPhone: string;
  remark: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  rating?: number;
  review?: string;
  reviewedAt?: string;
}

export interface Review {
  orderId: string;
  serviceName: string;
  auntName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export type UserRole = 'customer' | 'aunt';
export type SortType = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';
