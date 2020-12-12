import { createReducer, on } from '@ngrx/store';
import { customerAdapter, customerInitialState } from '@adapters';
import { CustomerAction } from '@actions';
import { CustomerState } from '@states';
export const customerFeatureKey = 'customer';
export const customerReducer = createReducer(
  customerInitialState,
  on(CustomerAction.FindAllAction,
    (state, action) => customerAdapter.setAll<CustomerState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(CustomerAction.FindAllSuccessAction,
    (state, action) => customerAdapter.setAll<CustomerState>(action.res, {
      ...state,
    })
  ),
  on(CustomerAction.ImportSuccessAction,
    (state, action) => customerAdapter.addMany<CustomerState>(action.res, {
      ...state,
    })
  ),
  on(CustomerAction.SaveSuccessAction,
    (state, action) => customerAdapter.upsertOne<CustomerState>(action.res, {
      ...state,
    })
  ),
  on(CustomerAction.ResetAction,
    () => customerAdapter.setAll<CustomerState>([], customerInitialState)
  ),
);
