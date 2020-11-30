import { AccountVM, CustomerVM } from '@view-models';

export interface NotificationVM {
  id: string;
  notification: any;
  data: any;
  account: AccountVM;
  customer: CustomerVM;
  type: string;
  isSeen: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
