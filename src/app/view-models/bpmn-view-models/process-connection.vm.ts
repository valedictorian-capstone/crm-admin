import { ProcessStepVM } from '.';

export interface ProcessConnectionVM {
  readonly id: string;
  readonly type: string;
  readonly description: string;
  readonly fromProcessStep: ProcessStepVM;
  readonly toProcessStep: ProcessStepVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessConnectionCM {
  type: string;
  description: string;
  fromProcessStepId: string;
  toProcessStepId: string;
}

export interface ProcessConnectionUM {
  id: string;
  type: string;
  description: string;
  fromProcessStepId: string;
  toProcessStepId: string;
}
