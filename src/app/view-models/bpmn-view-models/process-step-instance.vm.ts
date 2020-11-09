import { CommentVM, FormDataVM, ProcessInstanceVM, ProcessStepVM, TaskVM } from '..';

export interface ProcessStepInstanceVM {
  readonly id: string;
  readonly status: string;
  readonly note: string;
  readonly processStep: ProcessStepVM;
  readonly processInstance: ProcessInstanceVM;
  readonly tasks: TaskVM[];
  readonly comments: CommentVM[];
  readonly formDatas: FormDataVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProcessStepInstanceCM {
  status: string;
  note: string;
  processStep: ProcessStepVM;
  processInstance: ProcessInstanceVM;
}

export interface ProcessStepInstanceUM {
  id: string;
  status: string;
  note: string;
  processStep: ProcessStepVM;
  processInstance: ProcessInstanceVM;
}
