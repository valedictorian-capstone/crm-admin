import { StageVM } from '@view-models';

export interface PipelineVM {
  readonly id: string;
  readonly name: string;
  readonly stages: StageVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PipelineCM {
  name: string;
  stages: StageVM[];
}

export interface PipelineUM {
  id: string;
  name: string;
  stages: StageVM[];
}
