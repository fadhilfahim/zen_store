export type CartLine = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  size: string;
  color: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
};

