import { CampaignVM, DealVM } from '@view-models';

export interface AttachmentVM {
  id: string;
  name: string;
  extension: string;
  description: string;
  url: string;
  size: number;
  deal: DealVM;
  campaign: CampaignVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttachmentCM {
  name: string;
  description: string;
  extension: string;
  url: string;
  campaign: CampaignVM;
  size: number;
  deal: DealVM;
}

export interface AttachmentUM {
  id: string;
  name: string;
  description: string;
  size: number;
  campaign: CampaignVM;
  extension: string;
  url: string;
  deal: DealVM;
}
