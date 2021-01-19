import { LogVM, NoteVM, AttachmentVM, ActivityVM, DealVM, PipelineVM } from ".";
import { GroupVM } from "../basic-view-models";

export interface CampaignVM {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  autoCreateDeal: boolean;
  dateStart: Date;
  dateEnd: Date;
  groups: GroupVM[];
  logs: LogVM[];
  notes: NoteVM[];
  attachments: AttachmentVM[];
  activitys: ActivityVM[];
  deals: DealVM[];
  pipeline: PipelineVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  emailTemplate: string;
}

export interface CampaignCM {
  name: string;
  description: string;
  type: string;
  dateStart: Date;
  status: string;
  autoCreateDeal: boolean;
  dateEnd: Date;
  pipeline: PipelineVM;
  emailTemplate: string;
}

export interface CampaignUM {
  id: string;
  name: string;
  description: string;
  type: string;
  dateStart: Date;
  status: string;
  autoCreateDeal: boolean;
  dateEnd: Date;
  pipeline: PipelineVM;
  emailTemplate: string;
}
