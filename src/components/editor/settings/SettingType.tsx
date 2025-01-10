import IMediaAttachment from "../interfaces/IMediaAttachment";

export default interface SettingType {
  id: string;
  name: string;
  visible: boolean;
  type:
    | "TEXT"
    | "NUMBER"
    | "BOOLEAN"
    | "SELECT"
    | "COLOR"
    | "IMAGE"
    | "VIDEO"
    | "RANGE"
    | "UNKNOWN"
    | "CODE"
    | "TEXTAREA";
  value: string | number | boolean | IMediaAttachment | null;
  rangeMin?: number;
  rangeMax?: number;
  rangeStep?: number;
  options?: { id: string; name: string }[];
}
