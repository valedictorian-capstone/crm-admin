import { ProductVM } from '@view-models';

export interface CategoryVM {
  readonly id: string;
  readonly name: string;
  readonly products: ProductVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CategoryCM {
  name: string;
}

export interface CategoryUM {
  id: string;
  name: string;
}
