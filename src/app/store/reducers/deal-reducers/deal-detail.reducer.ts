import { DealDetailAction } from '@actions';
import { dealDetailAdapter, dealDetailInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { DealDetailState } from '@states';
export const dealDetailFeatureKey = 'dealDetail';
export const dealDetailReducer = createReducer(
  dealDetailInitialState,
  on(DealDetailAction.useFindAllAction,
    (state, action) => dealDetailAdapter.setAll<DealDetailState>([], {
      ...state,
      status: action.status
    })
  ),
  on(DealDetailAction.useFindAllSuccessAction,
    (state, action) => dealDetailAdapter.setAll<DealDetailState>(action.dealDetails, {
      ...state,
      status: action.status
    })
  ),
  on(DealDetailAction.useUpdateAction,
    (state, action) => dealDetailAdapter.setOne<DealDetailState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealDetailAction.useUpdateSuccessAction,
    (state, action) => dealDetailAdapter.updateOne<DealDetailState>({
      id: action.dealDetail.id,
      changes: action.dealDetail
    }, state)
  ),
  on(DealDetailAction.useCreateAction,
    (state, action) => dealDetailAdapter.setOne<DealDetailState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealDetailAction.useCreateSuccessAction,
    (state, action) => dealDetailAdapter.addOne<DealDetailState>(action.dealDetail, state)
  ),
  on(DealDetailAction.useRemoveAction,
    (state, action) => dealDetailAdapter.setOne<DealDetailState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(DealDetailAction.useRemoveSuccessAction,
    (state, action) => dealDetailAdapter.removeOne<DealDetailState>(action.id, state)
  ),
  on(DealDetailAction.useResetAction,
    (state, action) => dealDetailAdapter.setAll<DealDetailState>(action.dealDetails, dealDetailInitialState)
  ),
  on(DealDetailAction.useErrorAction,
    (state, action) => dealDetailAdapter.setOne<DealDetailState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
