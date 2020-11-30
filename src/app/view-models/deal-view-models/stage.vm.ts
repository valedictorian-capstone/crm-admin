import { AccountVM, DealVM, PipelineVM } from '@view-models';

export interface StageVM {
  id: string;
  name: string;
  description: string;
  probability: number;
  pipeline: PipelineVM;
  position: number;
  deals: DealVM[];
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageCM {
  name: string;
  description: string;
  position: number;
  probability: number;
  pipeline: PipelineVM;
}

export interface StageUM {
  id: string;
  name: string;
  description: string;
  position: number;
  probability: number;
  pipeline: PipelineVM;
}
