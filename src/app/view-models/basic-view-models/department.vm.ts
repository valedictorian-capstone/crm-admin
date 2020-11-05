import { AccountDepartmentVM } from '..';

export interface DepartmentVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accountDepartments: AccountDepartmentVM[];
  readonly childrens: DepartmentVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface DepartmentCM {
  name: string;
  description: string;
}

export interface DepartmentUM {
  id: string;
  name: string;
  description: string;
  accountDepartments: AccountDepartmentVM[];
}
