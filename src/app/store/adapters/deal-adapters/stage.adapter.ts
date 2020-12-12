import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { StageState } from '@states';
import { StageVM } from '@view-models';
export const stageAdapter: EntityAdapter<StageVM> = createEntityAdapter<StageVM>();

export const stageInitialState: StageState = stageAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
