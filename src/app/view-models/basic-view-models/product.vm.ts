import { CategoryVM } from './category.vm';

export interface ProductVM {
  id: string;
  code: string;
  name: string;
  image: string;
  category: CategoryVM;
  price: number;
  unit: string;
  description: string;
  parameters: {label: string, value: string}[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCM {
  id: string;
  code: string;
  name: string;
  category: CategoryVM;
  price: number;
  unit: string;
  image: string;
  parameters: {label: string, value: string}[];
  description: string;
}

export interface ProductUM {
  id: string;
  code: string;
  name: string;
  category: CategoryVM;
  price: number;
  image: string;
  unit: string;
  parameters: {label: string, value: string}[];
  description: string;
}
