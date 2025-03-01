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
    | "TEXTAREA"
    | "PAGE";
  value: string | number | boolean | IMediaAttachment | null;
  rangeMin?: number;
  rangeMax?: number;
  rangeStep?: number;
  options?: { id: string; name: string }[];
  condition?: (settings: SettingType[]) => boolean;
  onChange?: (value: string | number | boolean | IMediaAttachment | null) => void;
}
