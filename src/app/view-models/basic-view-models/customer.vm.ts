import { DeviceVM, GroupVM, NotificationVM, DealVM, TicketVM } from '@view-models';

export interface CustomerVM {
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
  groups: GroupVM[];
  devices: DeviceVM[];
  tickets: TicketVM[];
  deals: DealVM[];
  notifications: NotificationVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
