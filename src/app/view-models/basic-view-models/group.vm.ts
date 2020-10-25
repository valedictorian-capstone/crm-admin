import { CustomerVM } from '..';

export interface GroupVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly customers: CustomerVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface GroupCM {
  name: string;
  description: string;
}

export interface GroupUM {
  id: string;
  name: string;
  description: string;
}
