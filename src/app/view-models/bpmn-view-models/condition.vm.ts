import { WorkFlowVM } from '..';

export interface ConditionVM {
  readonly id: string;
  readonly name: string;
  readonly value: string;
  readonly workFlows: WorkFlowVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ConditionCM {
  name: string;
  value: string;
}

export interface ConditionUM {
  id: string;
  name: string;
  value: string;
}
