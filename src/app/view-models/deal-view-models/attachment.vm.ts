import { DealVM } from '@view-models';

export interface AttachmentVM {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly description: string;
  readonly url: string;
  readonly size: number;
  readonly deal: DealVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
