export interface WorkFlowConnectionVM {
  readonly id: string;
  readonly type: string;
  readonly description: string;
  readonly props: any;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WorkFlowConnectionCM {
  type: string;
  description: string;
  fromWorkFlowStepId: string;
  toWorkFlowStepId: string;
}

export interface WorkFlowConnectionUM {
  id: string;
  type: string;
  description: string;
  fromWorkFlowStepId: string;
  toWorkFlowStepId: string;
}