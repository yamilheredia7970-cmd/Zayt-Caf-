export type Language = 'en' | 'ar';

export type ProductCategory =
  | 'all'
  | 'specialty-coffee'
  | 'hot-drinks'
  | 'cold-drinks'
  | 'pastries'
  | 'bakery'
  | 'breakfast'
  | 'desserts';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface ProductBadge {
  en: string;
  ar: string;
  type: 'popular' | 'chef' | 'new' | 'signature';
}

export interface Product {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currency: LocalizedString;
  category: ProductCategory;
  image?: string;
  badge?: ProductBadge;
  isFeatured?: boolean;
}

export interface FeatureItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  iconName: 'coffee' | 'croissant' | 'sparkles' | 'heart-handshake';
}

export interface Testimonial {
  id: string;
  name: LocalizedString;
  role: LocalizedString;
  content: LocalizedString;
  rating: number;
  source: LocalizedString;
}

export interface GalleryItem {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  image: string;
  alt: LocalizedString;
  aspect?: 'square' | 'wide' | 'tall';
}

export interface OpeningHourRow {
  days: LocalizedString;
  hours: LocalizedString;
  isToday?: boolean;
}

export interface ContactDetails {
  brandName: LocalizedString;
  tagline: LocalizedString;
  address: LocalizedString;
  neighborhood: LocalizedString;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  parkingInfo: LocalizedString;
}
