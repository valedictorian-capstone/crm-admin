import { ProcessStepInstanceVM } from '.';
import { AccountVM } from '../account-view-models';

export interface CommentVM {
  readonly id: string;
  readonly account: AccountVM;
  readonly processStepInstance: ProcessStepInstanceVM;
  readonly message: string;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CommentCM {
  account: AccountVM;
  processStepInstance: ProcessStepInstanceVM;
  message: string;
}

export interface CommentUM {
  id: string;
  account: AccountVM;
  processStepInstance: ProcessStepInstanceVM;
  message: string;
}
