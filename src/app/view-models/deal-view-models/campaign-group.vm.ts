import { CampaignVM, GroupVM } from "@view-models";

export interface CampaignGroupVM {
  id: string;
  parameters: {value: string, label: string}[];
  group: GroupVM;
  campaign: CampaignVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignGroupCM {
  parameters: {value: string, label: string}[];
  group: GroupVM;
}

export interface CampaignGroupUM {
  parameters: ParameterVM[];
  group: GroupVM;
}

export interface ParameterVM {
  value: string;
  label: string
}
