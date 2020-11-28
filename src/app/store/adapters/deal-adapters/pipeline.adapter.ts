import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { PipelineState } from '@states';
import { PipelineVM } from '@view-models';
export const pipelineAdapter: EntityAdapter<PipelineVM> = createEntityAdapter<PipelineVM>();

export const pipelineInitialState: PipelineState = pipelineAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
