
export interface ProductVM {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type: string;
  readonly category: string;
  readonly price: number;
  readonly unit: string;
  readonly description: string;
  readonly parameters: {label: string, value: string}[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
