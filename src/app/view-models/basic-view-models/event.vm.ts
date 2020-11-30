import { AccountVM, GroupVM, StageVM } from '@view-models';

export interface EventVM {
  id: string;
  code: string;
  name: string;
  description: string;
  dateStart: Date;
  timeStart: Date;
  dateEnd: Date;
  timeEnd: Date;
  groups: GroupVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
