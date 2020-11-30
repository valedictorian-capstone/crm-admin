import { ProductVM } from '@view-models';

export interface CategoryVM {
  id: string;
  name: string;
  products: ProductVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCM {
  name: string;
}

export interface CategoryUM {
  id: string;
  name: string;
}
