import { DealVM } from '@view-models';

export interface AttachmentVM {
  id: string;
  name: string;
  extension: string;
  description: string;
  url: string;
  size: number;
  deal: DealVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttachmentCM {
  name: string;
  description: string;
  extension: string;
  url: string;
  size: number;
  deal: DealVM;
}

export interface AttachmentUM {
  id: string;
  name: string;
  description: string;
  size: number;
  extension: string;
  url: string;
  deal: DealVM;
}
