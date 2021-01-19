import { CampaignVM, DealVM } from "@view-models";

export interface INoteSearch {
  deal?: DealVM;
  campaign?: CampaignVM;
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
