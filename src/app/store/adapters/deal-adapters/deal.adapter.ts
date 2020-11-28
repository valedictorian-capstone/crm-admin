import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { DealState } from '@states';
import { DealVM } from '@view-models';
export const dealAdapter: EntityAdapter<DealVM> = createEntityAdapter<DealVM>();

export const dealInitialState: DealState = dealAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
