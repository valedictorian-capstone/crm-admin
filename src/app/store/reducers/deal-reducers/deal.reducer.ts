import { createReducer, on } from '@ngrx/store';
import { dealAdapter, dealInitialState } from '@adapters';
import { DealAction } from '@actions';
import { DealState } from '@states';
export const dealFeatureKey = 'deal';
export const dealReducer = createReducer(
  dealInitialState,
  on(DealAction.FindAllSuccessAction,
    (state, action) => dealAdapter.setAll<DealState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(DealAction.FindAllSuccessAction,
    (state, action) => dealAdapter.setAll<DealState>(action.res, {
      ...state,
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
  on(DealAction.ResetAction,
    () => dealAdapter.setAll<DealState>([], dealInitialState)
  ),
);
