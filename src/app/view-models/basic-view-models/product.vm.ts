
export interface ProductVM {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
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
  type: string;
  category: string;
  price: number;
  unit: string;
  parameters: {label: string, value: string}[];
  description: string;
}

export interface ProductUM {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  type: string;
  unit: string;
  parameters: {label: string, value: string}[];
  description: string;
}
