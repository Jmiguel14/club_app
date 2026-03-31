export type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  price: string;
  stock: number;
};
