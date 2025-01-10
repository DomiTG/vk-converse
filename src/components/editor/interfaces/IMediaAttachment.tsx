export default interface IMediaAttachment {
  id: number;
  name: string;
  type: "IMAGE" | "VIDEO" | "UNKNOWN";
  url: string;
  created_at: Date;
  size: number;
}
