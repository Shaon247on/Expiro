export interface StatCard {
  label: string;
  value: string;
  delta: string;
  iconBgStart: string;
  iconBgEnd: string;
  iconColor: string;
  icon: React.ReactNode;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  expireDate: string;
  totalProducts: number;
  status:
    | "Urgent"
    | "Expiring soon"
    | "Safe Item"
    | "Remove Item"
    | "Open Item";
  thumbnail: string;
}
