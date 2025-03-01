export default interface IPaymentMethod {
  id: number;
  converse_id: string;
  integration: "NONE" | "STRIPE";
  name: string;
  description?: string;
  prices: {
    currency: string;
    price: number;
  }[];
  settings: any;
  created_at: Date;
  updated_at: Date;
}
