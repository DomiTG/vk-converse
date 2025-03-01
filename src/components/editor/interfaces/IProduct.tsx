export default interface IProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  product_type: "PRODUCT" | "EMAIL";
  product_subtype: "PHYSICAL" | "DIGITAL";
  prices: string;
  tax_payer: boolean;
  tax_included: boolean;
  tax_rate: number;
  weight: number;
  email_html_content: string;
  attachments: string[];
  created_at: Date;
  updated_at: Date;
}
