import { FormValueVM } from '..';

export interface FormDataVM {
  readonly id: string;
  readonly workFlowStepInstanceId: string;
  readonly formGroupId: string;
  readonly formValues: FormValueVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FormDataCM {
  workFlowStepInstanceId: string;
  formGroupId: string;
}

export interface FormDataUM {
  id: string;
  workFlowStepInstanceId: string;
  formGroupId: string;
}
