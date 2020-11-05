import { GroupVM, ProcessStepInstanceVM } from '..';

export interface CustomerVM {
  readonly id: string;
  readonly phone: string;
  readonly email: string;
  readonly code: string;
  readonly fullname: string;
  readonly birthDate: Date;
  readonly avatar: string;
  readonly type: string;
  readonly province: string;
  readonly district: string;
  readonly gender: boolean;
  readonly groups: GroupVM[];
  readonly processStepInstances: ProcessStepInstanceVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CustomerCM {
  phone: string;
  email: string;
  code: string;
  fullname: string;
  avatar: string;
  province: string;
  birthDate: Date;
  district: string;
  gender: boolean;
  groups: GroupVM[];
  type: string;
}

export interface CustomerUM {
  id: string;
  phone: string;
  email: string;
  code: string;
  fullname: string;
  avatar: string;
  birthDate: Date;
  province: string;
  district: string;
  groups: GroupVM[];
  gender: boolean;
  type: string;
}
