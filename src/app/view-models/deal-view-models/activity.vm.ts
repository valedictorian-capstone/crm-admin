import { AccountVM, DealVM } from '@view-models';

export interface ActivityVM {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly location: string;
  readonly description: string;
  readonly status: string;
  readonly assignBy: AccountVM;
  readonly assignee: AccountVM;
  readonly deal: DealVM;
  readonly dateStart: Date;
  readonly dateEnd: Date;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
