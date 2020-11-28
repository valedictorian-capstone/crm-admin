import { DealVM, ProductVM } from '@view-models';

export interface DealDetailVM {
  readonly id: string;
  readonly quantity: number;
  readonly product: ProductVM;
  readonly deal: DealVM;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
