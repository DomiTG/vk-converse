export default interface IProduct {
  id: number;
  name: string;
  product_type: "PRODUCT" | "EMAIL";
  product_subtype: "PHYSICAL" | "DIGITAL";
  prices: { currency: string; amount: number }[];
  tax_payer: boolean;
  tax_included: boolean;
  tax_rate: number;
  weight: number;
  email_html_content: string;
  attachments: string[];
}
