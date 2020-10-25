import { AccountVM, CommentVM, CustomerVM, FormDataVM } from '..';

export interface WorkFlowStepInstanceVM {
  readonly id: string;
  readonly status: string;
  readonly note: string;
  readonly workFlowStepId: string;
  readonly workFlowInstanceId: string;
  readonly commentVMs: CommentVM[];
  readonly customers: CustomerVM[];
  readonly accounts: AccountVM[];
  readonly formDataVMs: FormDataVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WorkFlowStepInstanceCM {
  status: string;
  note: string;
  workFlowStepId: string;
  workFlowInstanceId: string;
}

export interface WorkFlowStepInstanceUM {
  id: string;
  status: string;
  note: string;
  workFlowStepId: string;
  workFlowInstanceId: string;
}
