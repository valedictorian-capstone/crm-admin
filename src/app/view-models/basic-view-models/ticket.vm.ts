import { AccountVM, StageVM, CustomerVM } from '@view-models';

export interface TicketVM {
  id: string;
  description: string;
  note: string;
  type: string;
  ability: number;
  customer: CustomerVM;
  assignee: AccountVM;
  status: string;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketCM {
  description: string;
  note: string;
  type: string;
  ability: number;
  customer: CustomerVM;
  status: string;
}

export interface TicketUM {
  id: string;
  description: string;
  note: string;
  type: string;
  ability: number;
  customer: CustomerVM;
  status: string;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
}
