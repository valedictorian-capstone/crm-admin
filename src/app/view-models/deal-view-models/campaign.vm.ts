import { CustomerVM } from "@view-models";
import { LogVM, NoteVM, AttachmentVM, ActivityVM, DealVM, PipelineVM } from ".";
import { CampaignGroupVM } from ".";

export interface CampaignVM {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  autoCreateDeal: boolean;
  dateStart: Date;
  dateEnd: Date;
  followers: CustomerVM[];
  campaignGroups: CampaignGroupVM[];
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
