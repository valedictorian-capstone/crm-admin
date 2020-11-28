import { EntityState } from '@ngrx/entity';
import { PipelineVM } from '@view-models';

export interface PipelineState extends EntityState<PipelineVM> {
  status: string;
  error: string;
}
