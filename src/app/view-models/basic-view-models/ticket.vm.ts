import { AccountVM, StageVM, CustomerVM } from '@view-models';

export interface TicketVM {
  id: string;
  title: string;
  description: string;
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
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
}

export interface TicketUM {
  id: string;
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
}
