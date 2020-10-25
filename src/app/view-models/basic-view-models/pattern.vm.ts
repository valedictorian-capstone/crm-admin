import { FormControlVM } from '..';

export interface PatternVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly formControls: FormControlVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PatternCM {
  name: string;
  description: string;
}

export interface PatternUM {
  id: string;
  name: string;
  description: string;
}
