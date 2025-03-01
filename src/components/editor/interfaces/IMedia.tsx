import IMediaAttachment from "./IMediaAttachment";

export default interface IMedia {
  stats: {
    available: number;
    max: number;
    used: number;
  };
  media: IMediaAttachment[];
}
