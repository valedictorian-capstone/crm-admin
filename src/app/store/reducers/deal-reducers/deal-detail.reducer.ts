import { createReducer, on } from '@ngrx/store';
import { dealDetailAdapter, dealDetailInitialState } from '@adapters';
import { DealDetailAction } from '@actions';
import { DealDetailState } from '@states';
export const dealDetailFeatureKey = 'dealDetail';
export const dealDetailReducer = createReducer(
  dealDetailInitialState,
  on(DealDetailAction.FindAllSuccessAction,
    (state, action) => dealDetailAdapter.setAll<DealDetailState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(DealDetailAction.SaveSuccessAction,
    (state, action) => dealDetailAdapter.upsertOne<DealDetailState>(action.res, {
      ...state,
    })
  ),
  on(DealDetailAction.RemoveSuccessAction,
    (state, action) => dealDetailAdapter.removeOne<DealDetailState>(action.id, {
      ...state,
    })
  ),
  on(DealDetailAction.ListAction,
    (state, action) => dealDetailAdapter.upsertMany<DealDetailState>(action.res, {
      ...state,
    })
  ),
  on(DealDetailAction.ResetAction,
    () => dealDetailAdapter.setAll<DealDetailState>([], dealDetailInitialState)
  ),
);
