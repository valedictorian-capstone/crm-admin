import { AccountVM, CustomerVM } from "@view-models";

export interface ITicketSearch {
  types: string[];
  statuss: string[];
  customer: CustomerVM;
  assignee: AccountVM;
  range?: { start: Date, end: Date };
  feedbackAssignee: AccountVM;
  feedbackStatuss: string[];
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
