import { DealVM } from '@view-models';

export interface NoteVM {
  readonly id: string;
  readonly description: string;
  readonly pin: boolean;
  readonly deal: DealVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
