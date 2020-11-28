import { AccountVM, GroupVM, StageVM } from '@view-models';

export interface TriggerVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly content: string;
  readonly runDate: Date;
  readonly groups: GroupVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TriggerCM {
  name: string;
  description: string;
  content: string;
  runDate: Date;
  groups: GroupVM[];
}

export interface TriggerUM {
  id: string;
  name: string;
  description: string;
  content: string;
  runDate: Date;
  groups: GroupVM[];
}
