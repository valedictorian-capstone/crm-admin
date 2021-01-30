import { CustomerVM } from "@view-models";

export interface ICommentSearch {
  range?: { start: Date, end: Date };
  customer?: CustomerVM;
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
