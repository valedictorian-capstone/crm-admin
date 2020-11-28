import { AccountVM, CustomerVM } from '@view-models';

export interface NotificationVM {
  readonly id: string;
  readonly notification: any;
  readonly data: any;
  readonly account: AccountVM;
  readonly customer: CustomerVM;
  readonly type: string;
  readonly isSeen: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
