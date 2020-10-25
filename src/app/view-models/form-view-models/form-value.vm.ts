export interface FormValueVM {
  readonly id: string;
  readonly formControlId: string;
  readonly formDataId: string;
  readonly value: string;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FormValueCM {
  formControlId: string;
  formDataId: string;
  value: string;
}

export interface FormValueUM {
  id: string;
  formControlId: string;
  formDataId: string;
  value: string;
}