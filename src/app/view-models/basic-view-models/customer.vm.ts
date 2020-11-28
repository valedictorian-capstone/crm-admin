import { DeviceVM, GroupVM, NotificationVM, DealVM, TicketVM } from '@view-models';

export interface CustomerVM {
  readonly id: string;
  readonly phone: string;
  readonly email: string;
  readonly fullname: string;
  readonly birthDay: Date;
  readonly avatar: string;
  readonly source: string;
  readonly type: string;
  readonly frequency: number;
  readonly totalSpending: number;
  readonly totalDeal: number;
  readonly gender: string;
  readonly company: string;
  readonly fax: string;
  readonly website: string;
  readonly stage: string;
  readonly skypeName: string;
  readonly facebook: string;
  readonly twitter: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly description: string;
  readonly groups: GroupVM[];
  readonly devices: DeviceVM[];
  readonly tickets: TicketVM[];
  readonly deals: DealVM[];
  readonly notifications: NotificationVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CustomerCM {
  phone: string;
  email: string;
  fullname: string;
  birthDay: Date;
  avatar: string;
  source: string;
  type: string;
  frequency: number;
  totalSpending: number;
  totalDeal: number;
  gender: string;
  company: string;
  fax: string;
  website: string;
  stage: string;
  skypeName: string;
  facebook: string;
  twitter: string;
  street: string;
  city: string;
  state: string;
  country: string;
  description: string;
}

export interface CustomerUM {
  id: string;
  phone: string;
  email: string;
  fullname: string;
  birthDay: Date;
  avatar: string;
  source: string;
  type: string;
  frequency: number;
  totalSpending: number;
  totalDeal: number;
  gender: string;
  company: string;
  fax: string;
  website: string;
  stage: string;
  skypeName: string;
  facebook: string;
  twitter: string;
  street: string;
  city: string;
  state: string;
  country: string;
  description: string;
}
