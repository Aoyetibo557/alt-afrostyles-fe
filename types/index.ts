export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  profile_picture: string;
  subscription_Status: string;
  subscription_end_date: Date;
  created_at: TimeStamp;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  designer_id: string;
  price: number;
  images: string[];
  type: strig;
  categories: string[];
  quantity: number;
  is_draft: boolean;
  is_published: boolean;
}

export interface IStore {
  store_name: string;
  store_description?: string;
  inventory?: IProduct[];
  store_image?: string;
  is_featured?: boolean;
}

export interface AuthResponse {
  user?: {};
  messageType: string;
  accessToken: string;
  refreshToken: string;
}

export interface SimpleResponse {
  data?: {} | any;
  message?: string;
  messageType: string;
  statusCode: number;
}

export interface Credentials {
  email: string;
  password: string;
  name?: string;
  userType?: string;
}

export interface AuthContextType {
  user: IUser | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: {
    name: string;
    email: string;
    password: string;
    userType: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export interface DesignerContextProps {
  designerProfile: IStore;
  inventory: IProduct[];
  refetchDesignerProfile: () => void;
  refetchInventory: () => void;
  updateDesginerProfile: (designerProfile: Partial<IStore>) => void;
  updateStoreInventory: (inventory: IProduct[]) => void;
}

export interface ICartItem {
  product_id: string;
  quantity: number;
  price_at_addition: number;
  product_name: string;
}

export interface IAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string;
}

export interface IShippingAdress extends IAddress {
  id: string;
  full_name?: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELED = "CANCELED",
}

export interface IOrder {
  id: string;
  user_id: string;
  designer_id: string;
  order_number: string; // A human-readable order number
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping_cost?: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: "PENDING" | "PAID" | "FAILED";
  payment_method: string;
  shipping_address: IAddress;
  billing_address: IAddress;
  shipping_comany?: string;
  tracking_number?: string;
  is_international?: boolean;
  estimated_delivery_date?: Timestamp;
  notes?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface IOrderSummary {
  id: string;
  order_number: string;
  user_id: string;
  designer_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: Timestamp;
}

export enum ErrorType {
  NETWORK = "NETWORK",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}
