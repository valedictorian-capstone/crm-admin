import { FormGroupVM, ProcessStepInstanceVM, ProcessConnectionVM, DepartmentVM, ProcessVM } from '..';

export interface ProcessStepVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly type: string;
  readonly subType: string;
  readonly processFromConnections: ProcessConnectionVM[];
  readonly processToConnections: ProcessConnectionVM[];
  readonly processStepInstances: ProcessStepInstanceVM[];
  readonly formGroups: FormGroupVM[];
  readonly department: DepartmentVM;
  readonly process: ProcessVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessStepCM {
  name: string;
  description: string;
  type: string;
  subType: string;
  process: ProcessVM;
}

export interface ProcessStepUM {
  id: string;
  name: string;
  description: string;
  type: string;
  subType: string;
  department: DepartmentVM;
  processFromConnections: ProcessConnectionVM[];
  processToConnections: ProcessConnectionVM[];
  formGroups: FormGroupVM[];
  process: ProcessVM;
}
