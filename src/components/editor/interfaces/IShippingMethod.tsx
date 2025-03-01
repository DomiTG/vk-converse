export default interface IShippingMethod {
  id: number;
  converse_id: string;
  integration: "NONE" | "PACKETA";
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
