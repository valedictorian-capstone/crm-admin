
export interface ICampaignSearch {
  name?: string;
  types: string[];
  range?: { start: Date, end: Date };
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
