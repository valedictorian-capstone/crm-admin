import { AccountVM, DealVM } from '@view-models';

export interface ActivityVM {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  status: string;
  assignBy: AccountVM;
  assignee: AccountVM;
  deal: DealVM;
  dateStart: Date;
  dateEnd: Date;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityCM {
  name: string;
  type: string;
  location: string;
  description: string;
  assignBy: AccountVM;
  assignee: AccountVM;
  status: string;
  deal: DealVM;
  dateStart: Date;
  dateEnd: Date;
}

export interface ActivityUM {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  assignBy: AccountVM;
  assignee: AccountVM;
  status: string;
  deal: DealVM;
  dateStart: Date;
  dateEnd: Date;
}
