import { DealVM, ProductVM } from '@view-models';

export interface DealDetailVM {
  id: string;
  quantity: number;
  product: ProductVM;
  deal: DealVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealDetailCM {
  quantity: number;
  product: ProductVM;
  deal: DealVM;
}

export interface DealDetailUM {
  id: string;
  quantity: number;
  product: ProductVM;
  deal: DealVM;
}
