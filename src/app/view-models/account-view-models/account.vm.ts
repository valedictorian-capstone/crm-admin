import { RoleVM } from '../basic-view-models';
import { AccountDepartmentVM } from './account-department.vm';

export interface AccountVM {
  readonly id: string;
  readonly phone: string;
  readonly email: string;
  readonly code: string;
  readonly fullname: string;
  readonly avatar: string;
  readonly address: string;
  readonly gender: boolean;
  readonly roles: RoleVM[];
  readonly accountDepartments: AccountDepartmentVM[];
  readonly currentValidateCode: string;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AccountCM {
  phone: string;
  email: string;
  code: string;
  fullname: string;
  avatar: string;
  address: string;
  gender: boolean;
  password: string;
  roles: RoleVM[];
  currentValidateCode: string;
}

export interface AccountUM {
  id: string;
  phone: string;
  email: string;
  code: string;
  fullname: string;
  avatar: string;
  address: string;
  gender: boolean;
  password: string;
  roles: RoleVM[];
  currentValidateCode: string;
}
