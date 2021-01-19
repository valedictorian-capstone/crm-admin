import { CampaignVM, DealVM } from '@view-models';

export interface LogVM {
  id: string;
  description: string;
  deal: DealVM;
  campaign: CampaignVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogCM {
  description: string;
  deal: DealVM;
  campaign: CampaignVM;
}

export interface LogUM {
  id: string;
  description: string;
  deal: DealVM;
  campaign: CampaignVM;
}
