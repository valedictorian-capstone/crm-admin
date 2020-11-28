import { AccountVM, DealVM, PipelineVM } from '@view-models';

export interface StageVM {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly probability: number;
  readonly pipeline: PipelineVM;
  readonly position: number;
  readonly deals: DealVM[];
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
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
