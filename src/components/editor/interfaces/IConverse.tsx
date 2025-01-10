import IProduct from "./IProduct";
import ITemplate from "./ITemplate";

export default interface IConverse {
  id: string;
  created_at: Date;
  description: string;
  live_mode: boolean;
  name: string;
  product: IProduct;
  template: ITemplate;
}
