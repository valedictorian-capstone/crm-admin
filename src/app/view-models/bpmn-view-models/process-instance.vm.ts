import { ProcessStepInstanceVM } from '..';

export interface ProcessInstanceVM {
  readonly id: string;
  readonly code: string;
  readonly workFlowId: string;
  readonly note: string;
  readonly workFlowStepInstanceVMs: ProcessStepInstanceVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessInstanceCM {
  code: string;
  workFlowId: string;
  note: string;
}

export interface ProcessInstanceUM {
  id: string;
  code: string;
  workFlowId: string;
  note: string;
}
