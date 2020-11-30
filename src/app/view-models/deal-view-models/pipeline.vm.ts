import { StageVM } from '@view-models';

export interface PipelineVM {
  id: string;
  name: string;
  stages: StageVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
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
