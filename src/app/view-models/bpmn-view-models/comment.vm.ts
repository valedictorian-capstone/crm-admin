export interface CommentVM {
  id: string;
  readonly accountId: string;
  readonly workFlowStepInstanceId: string;
  readonly value: string;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CommentCM {
  accountId: string;
  workFlowStepInstanceId: string;
  value: string;
}

export interface CommentUM {
  id: string;
  accountId: string;
  workFlowStepInstanceId: string;
  value: string;
}
