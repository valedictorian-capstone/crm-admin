import { AccountVM, StageVM, CustomerVM, DealDetailVM, AttachmentVM, NoteVM, ActivityVM, LogVM, CampaignVM } from '@view-models';

export interface DealVM {
  id: string;
  title: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  status: string;
  service: string;
  assignee: AccountVM;
  campaign: CampaignVM;
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
  feedbackAssigneeRating: number;
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
  service: string;
  stage: StageVM;
  status: string;
  campaign: CampaignVM;
  dealDetails: DealDetailVM[];
}

export interface DealUM {
  id: string;
  title: string;
  service: string;
  description: string;
  customer: CustomerVM;
  stage: StageVM;
  campaign: CampaignVM;
  status: string;
  assignee: AccountVM;
  feedbackAssignee: AccountVM;
  feedbackAssigneeRating: number;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
  dealDetails: DealDetailVM[];
}
