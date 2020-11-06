import { ProcessInstanceVM, ProcessStepVM } from '..';

export interface ProcessVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly code: string;
  readonly processSteps: ProcessStepVM[];
  readonly processInstances: ProcessInstanceVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessCM {
  name: string;
  description: string;
  code: string;
}

export interface ProcessUM {
  id: string;
  name: string;
  description: string;
  code: string;
  processSteps: ProcessStepVM[];
  isDelete: boolean;
}
