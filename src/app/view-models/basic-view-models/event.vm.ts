import { AccountVM, GroupVM, StageVM, TriggerVM } from '@view-models';

export interface EventVM {
  id: string;
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  groups: GroupVM[];
  triggers: TriggerVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCM {
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  triggers: TriggerVM[];
  groups: GroupVM[];
}

export interface EventUM {
  id: string;
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  triggers: TriggerVM[];
  groups: GroupVM[];
}
