export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'merienda-bebidas' | 'merienda-dulces' | 'merienda-salados' | 'cena-bebidas' | 'cena-comidas';
  subcategoria?: string;
  image: string;
  description?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoria?: string;
  imagen_url?: string;
  disponible?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: number;
  items: CartItem[];
  total: number;
  paymentMethod: 'efectivo' | 'transferencia';
  proofImage?: string;
  status: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  createdAt: Date;
}

export interface VendorUser {
  username: string;
  role: 'vendor';
}
