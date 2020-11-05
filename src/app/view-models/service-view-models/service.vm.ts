
export interface ServiceVM {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type: string;
  readonly price: number;
  readonly description: string;
  readonly parameters: {label: string, value: string}[];
  readonly image: string;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ServiceCM {
  id: string;
  code: string;
  name: string;
  type: string;
  price: number;
  image: string;
  parameters: {label: string, value: string}[];
  description: string;
}

export interface ServiceUM {
  id: string;
  code: string;
  name: string;
  type: string;
  price: number;
  parameters: {label: string, value: string}[];
  image: string;
  description: string;
}
