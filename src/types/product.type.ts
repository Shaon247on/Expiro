export type ProductStatus =
  | "Urgent"
  | "Expiring soon"
  | "Safe Item"
  | "Remove Item"
  | "Open Item";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  expireDate: string;
  totalProducts: number;
  status: ProductStatus;
  thumbnail: string;
  /** Extra detail fields shown in the View dialog */
  barcode?: string;
  storeName?: string;
  datePurchased?: string;
  openExpiryDays?: number;
  description?: string;
  quantity?: number;
}