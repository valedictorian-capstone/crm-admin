import { AccountVM, GroupVM, StageVM } from '@view-models';
import { EventVM } from '@view-models';

export interface TriggerVM {
  id: string;
  time: string;
  event: EventVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TriggerCM {
  time: string;
  event: EventVM;
}

export interface TriggerUM {
  id: string;
  time: string;
  event: EventVM;
}
