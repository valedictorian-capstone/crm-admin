import { createReducer, on } from '@ngrx/store';
import { dealAdapter, dealInitialState } from '@adapters';
import { DealAction } from '@actions';
import { DealState } from '@states';
export const dealFeatureKey = 'deal';
export const dealReducer = createReducer(
  dealInitialState,
  on(DealAction.FindAllSuccessAction,
    (state, action) => dealAdapter.setAll<DealState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(DealAction.SaveSuccessAction,
    (state, action) => dealAdapter.upsertOne<DealState>(action.res, {
      ...state,
    })
  ),
  on(DealAction.RemoveSuccessAction,
    (state, action) => dealAdapter.removeOne<DealState>(action.id, {
      ...state,
    })
  ),
  on(DealAction.ListAction,
    (state, action) => dealAdapter.upsertMany<DealState>(action.res, {
      ...state,
    })
  ),
  on(DealAction.ResetAction,
    () => dealAdapter.setAll<DealState>([], dealInitialState)
  ),
);
