import { AccountVM, GroupVM, StageVM } from '@view-models';

export interface EventVM {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly dateStart: Date;
  readonly timeStart: Date;
  readonly dateEnd: Date;
  readonly timeEnd: Date;
  readonly groups: GroupVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface EventCM {
  code: string;
  name: string;
  description: string;
  groups: GroupVM[];
}

export interface EventUM {
  id: string;
  code: string;
  name: string;
  description: string;
  groups: GroupVM[];
}
