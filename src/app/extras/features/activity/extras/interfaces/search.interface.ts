import { AccountVM, CampaignVM, DealVM } from "@view-models";

export interface IActivitySearch {
  name?: string;
  types: string[];
  range?: { start: Date, end: Date };
  assignee?: AccountVM;
  deal?: DealVM;
  campaign?: CampaignVM;
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
