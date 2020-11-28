import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { DealDetailState } from '@states';
import { DealDetailVM } from '@view-models';
export const dealDetailAdapter: EntityAdapter<DealDetailVM> = createEntityAdapter<DealDetailVM>();

export const dealDetailInitialState: DealDetailState = dealDetailAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
