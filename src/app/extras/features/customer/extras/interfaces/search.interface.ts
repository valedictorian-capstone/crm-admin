import { GroupVM } from "@view-models";

export interface ICustomerSearch {
  value?: string;
  genders: string[];
  skypeName?: string;
  facebook?: string;
  twitter?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  totalDeal?: { from: number, to: number };
  totalSpending?: { from: number, to: number };
  frequency?: { from: number, to: number };
  groups: GroupVM[];
  birthDay?: { start: Date, end: Date };
  isDelete?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
