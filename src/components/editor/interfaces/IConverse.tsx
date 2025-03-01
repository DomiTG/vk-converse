import IConverseDomain from "./IConverseDomain";
import IConverseSeo from "./IConverseSeo";

export default interface IConverse {
  id: string;
  name: string;
  description?: string;
  type: "PRODUCT" | "EMAIL";
  created_at: Date;
  template: string;
  updated_at: Date;
  live_mode: boolean;
  domains: IConverseDomain[];
  seo?: IConverseSeo;
}
