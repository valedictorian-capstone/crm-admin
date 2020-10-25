import { AccountVM, PermissionVM } from '..';

export interface RoleVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accounts: AccountVM[];
  readonly permissions: PermissionVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RoleCM {
  name: string;
  description: string;
}

export interface RoleUM {
  id: string;
  name: string;
  description: string;
}
