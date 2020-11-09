import { ProcessStepInstanceVM } from '.';
import { AccountVM } from '../account-view-models';
import { CustomerVM } from '../customer-view-models';


export interface TaskVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly assignee: AccountVM;
  readonly processStepInstance: ProcessStepInstanceVM;
  readonly customer: CustomerVM;
  readonly assignBy: AccountVM;
  readonly status: string;
  readonly deadline: Date;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly isDelete: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TaskCM {
  name: string;
  description: string;
  assignee: AccountVM;
  processStepInstance: ProcessStepInstanceVM;
  customer: CustomerVM;
  assignBy: AccountVM;
  status: string;
  deadline: Date;
}

export interface TaskUM {
  name: string;
  description: string;
  assignee: AccountVM;
  processStepInstance: ProcessStepInstanceVM;
  customer: CustomerVM;
  assignBy: AccountVM;
  status: string;
  deadline: Date;
}
