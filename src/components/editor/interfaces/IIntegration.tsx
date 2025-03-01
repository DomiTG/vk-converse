import IConverse from "./IConverse";

export default interface IIntegration {
  id: number;
  converse_id: string;
  converse: IConverse;
  integration_type: "PACKETA" | "STRIPE";
  enabled: boolean;
  values: {
    key: string;
    value: string;
  }[];
}
