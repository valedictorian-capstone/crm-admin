import { DealAction } from '@actions';
import { dealAdapter, dealInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { DealState } from '@states';
export const dealFeatureKey = 'deal';
export const dealReducer = createReducer(
  dealInitialState,
  on(DealAction.useFindAllAction,
    (state, action) => dealAdapter.setAll<DealState>([], {
      ...state,
      status: action.status
    })
  ),
  on(DealAction.useFindAllSuccessAction,
    (state, action) => dealAdapter.setAll<DealState>(action.deals, {
      ...state,
      status: action.status
    })
  ),
  on(DealAction.useUpdateAction,
    (state, action) => dealAdapter.setOne<DealState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealAction.useUpdateSuccessAction,
    (state, action) => dealAdapter.updateOne<DealState>({
      id: action.deal.id,
      changes: action.deal
    }, state)
  ),
  on(DealAction.useCreateAction,
    (state, action) => dealAdapter.setOne<DealState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealAction.useCreateSuccessAction,
    (state, action) => dealAdapter.addOne<DealState>(action.deal, state)
  ),
  on(DealAction.useRemoveAction,
    (state, action) => dealAdapter.setOne<DealState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealAction.useRemoveSuccessAction,
    (state, action) => dealAdapter.removeOne<DealState>(action.id, state)
  ),
  on(DealAction.useResetAction,
    (state, action) => dealAdapter.setAll<DealState>(action.deals, dealInitialState)
  ),
  on(DealAction.useErrorAction,
    (state, action) => dealAdapter.setOne<DealState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
