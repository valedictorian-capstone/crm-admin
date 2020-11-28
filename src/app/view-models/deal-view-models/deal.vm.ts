import { AccountVM, StageVM, CustomerVM, DealDetailVM, AttachmentVM, NoteVM, ActivityVM } from '@view-models';

export interface DealVM {
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
  readonly dealDetails: DealDetailVM[];
  readonly notes: NoteVM[];
  readonly attachments: AttachmentVM[];
  readonly activitys: ActivityVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
  feedbackAssignee: AccountVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
  dealDetails: DealDetailVM[];
}
