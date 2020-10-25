
export interface ProductVM {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly description: string;
  readonly image: string;
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
  brand: string;
  price: number;
  image: string;
  description: string;
}

export interface ProductUM {
  id: string;
  code: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
}
