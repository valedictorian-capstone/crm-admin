import { CustomerVM } from '..';

export interface GroupVM {
  id: string;
  name: string;
  description: string;
  customers: CustomerVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
