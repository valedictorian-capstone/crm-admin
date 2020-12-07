import { AccountVM, CustomerVM } from '@view-models';

export interface NotificationVM {
  id: string;
  data: any;
  account: AccountVM;
  customer: CustomerVM;
  type: string;
  body: string;
  icon: string;
  title: string;
  name: string;
  isSeen: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
