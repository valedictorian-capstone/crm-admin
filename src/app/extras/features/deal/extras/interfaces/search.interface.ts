import { AccountVM, CampaignVM, CustomerVM } from "@view-models";

export interface IDealSearch {
  title?: string;
  statuss: string[];
  customer?: CustomerVM;
  assignee?: AccountVM;
  campaign?: CampaignVM;
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
