import { AccountVM, StageVM, CustomerVM } from '@view-models';

export interface TicketVM {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly customer: CustomerVM;
  readonly assignee: AccountVM;
  readonly status: string;
  readonly feedbackAssignee: AccountVM;
  readonly feedbackMessage: string;
  readonly feedbackStatus: string;
  readonly feedbackRating: number;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TicketCM {
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
}

export interface TicketUM {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly customer: CustomerVM;
  readonly stage: StageVM;
  readonly status: string;
  readonly feedbackAssignee: AccountVM;
  readonly feedbackMessage: string;
  readonly feedbackStatus: string;
  readonly feedbackRating: number;
}
