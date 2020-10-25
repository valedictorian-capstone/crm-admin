import { WorkFlowStepInstanceVM } from '..';

export interface WorkFlowInstanceVM {
  readonly id: string;
  readonly code: string;
  readonly workFlowId: string;
  readonly note: string;
  readonly workFlowStepInstanceVMs: WorkFlowStepInstanceVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WorkFlowInstanceCM {
  code: string;
  workFlowId: string;
  note: string;
}

export interface WorkFlowInstanceUM {
  id: string;
  code: string;
  workFlowId: string;
  note: string;
}
