import { AccountVM, StageVM, CustomerVM, DealDetailVM, AttachmentVM, NoteVM, ActivityVM, LogVM } from '@view-models';

export interface DealVM {
  id: string;
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
  assignee: AccountVM;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: boolean;
  feedbackRating: number;
  dealDetails: DealDetailVM[];
  notes: NoteVM[];
  attachments: AttachmentVM[];
  activitys: ActivityVM[];
  logs: LogVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealCM {
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
  dealDetails: DealDetailVM[];
}

export interface DealUM {
  id: string;
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
  assignee: AccountVM;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: boolean;
  feedbackRating: number;
  dealDetails: DealDetailVM[];
}
