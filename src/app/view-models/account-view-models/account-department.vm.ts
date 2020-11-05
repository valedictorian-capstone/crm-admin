import { AccountVM } from '.';
import { DepartmentVM } from '../basic-view-models';

export interface AccountDepartmentVM {

  readonly id: string;

  readonly isDelete: boolean;

  readonly isLeader: boolean;

  readonly account: AccountVM;

  readonly department: DepartmentVM;

  readonly description: string;

  readonly createdBy: string;

  readonly updatedBy: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export interface AccountDepartmentCM {

  account: { id: string };

  department: { id: string };

  isLeader: boolean;
  description: string;

}

export interface AccountDepartmentUM {

  id: string;

  account: { id: string };

  department: { id: string };

  isLeader: boolean;
  description: string;
}
