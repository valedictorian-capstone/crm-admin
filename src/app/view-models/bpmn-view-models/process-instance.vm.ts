import { CustomerVM, ProcessStepInstanceVM, ProcessVM } from '..';

export interface ProcessInstanceVM {
  readonly id: string;
  readonly code: string;
  readonly process: ProcessVM;
  readonly customer: CustomerVM;
  readonly description: string;
  readonly processStepInstances: (ProcessStepInstanceVM & { isEmoji?: boolean})[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessInstanceCM {
  process: ProcessVM;
  customer: CustomerVM;
  description: string;
}

export interface ProcessInstanceUM {
  id: string;
  process: ProcessVM;
  customer: CustomerVM;
  description: string;
}
