import { DealVM } from '@view-models';

export interface NoteVM {
  id: string;
  description: string;
  pin: boolean;
  deal: DealVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCM {
  description: string;
  pin: boolean;
  deal: DealVM;
}

export interface NoteUM {
  id: string;
  description: string;
  pin: boolean;
  deal: DealVM;
}
