import { WorkFlowStepVM, ConditionVM, WorkFlowConnectionVM } from '..';

export interface WorkFlowVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly code: string;
  readonly props: any;
  readonly conditions: ConditionVM[];
  readonly wFSteps: WorkFlowStepVM[];
  readonly wfConnections: WorkFlowConnectionVM[];
  readonly isDraft: boolean;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WorkFlowCM {
  name: string;
  description: string;
  code: string;
  isDraft: boolean;
}

export interface WorkFlowUM {
  id: string;
  name: string;
  description: string;
  props: any;
  code: string;
  conditions: ConditionVM[];
  wFSteps: WorkFlowStepVM[];
  wfConnections: WorkFlowConnectionVM[];
  isDraft: boolean;
  isDelete: boolean;
}
