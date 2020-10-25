import { WorkFlowStepVM, RoleVM } from '..';

export interface PermissionVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly workFlowSteps: WorkFlowStepVM[];
  readonly roles: RoleVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PermissionCM {
  name: string;
  description: string;
}

export interface PermissionUM {
  id: string;
  name: string;
  description: string;
}
