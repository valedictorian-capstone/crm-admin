import { CustomerVM, AccountVM } from '@view-models';
export interface DeviceVM {
  readonly id: string;
  readonly browser: string;
  readonly browserVersion: string;
  readonly os: string;
  readonly osVersion: string;
  readonly userAgent: string;
  readonly env: string;
  readonly account: AccountVM;
  readonly customer: CustomerVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
export interface DeviceCM {
  readonly id: string;
  readonly browser: string;
  readonly browserVersion: string;
  readonly os: string;
  readonly osVersion: string;
  readonly userAgent: string;
  readonly env: string;
  readonly account: AccountVM;
  readonly customer: CustomerVM;
}

export interface DeviceUM {
  readonly id: string;
  readonly browser: string;
  readonly browserVersion: string;
  readonly os: string;
  readonly osVersion: string;
  readonly userAgent: string;
  readonly env: string;
  readonly account: AccountVM;
  readonly customer: CustomerVM;
}
