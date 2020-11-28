import { CustomerAction } from '@actions';
import { customerAdapter, customerInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { CustomerState } from '@states';
export const customerFeatureKey = 'customer';
export const customerReducer = createReducer(
  customerInitialState,
  on(CustomerAction.useFindAllAction,
    (state, action) => customerAdapter.setAll<CustomerState>([], {
      ...state,
      status: action.status
    })
  ),
  on(CustomerAction.useFindAllSuccessAction,
    (state, action) => customerAdapter.setAll<CustomerState>(action.customers, {
      ...state,
      status: action.status
    })
  ),
  on(CustomerAction.useUpdateAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CustomerAction.useUpdateSuccessAction,
    (state, action) => customerAdapter.updateOne<CustomerState>({
      id: action.customer.id,
      changes: action.customer
    }, state)
  ),
  on(CustomerAction.useCreateAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CustomerAction.useCreateSuccessAction,
    (state, action) => customerAdapter.addOne<CustomerState>(action.customer, state)
  ),
  on(CustomerAction.useRemoveAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CustomerAction.useRemoveSuccessAction,
    (state, action) => customerAdapter.removeOne<CustomerState>(action.id, state)
  ),
  on(CustomerAction.useResetAction,
    (state, action) => customerAdapter.setAll<CustomerState>(action.customers, customerInitialState)
  ),
  on(CustomerAction.useUniqueAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: action.status,
      unique: {
        label: action.data.label,
        value: action.data.value,
        exist: false,
      }
    }),
  ),
  on(CustomerAction.useUniqueSuccessAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: 'done',
      unique: {
        ...state.unique,
        exist: action.result,
      }
    })
  ),
  on(CustomerAction.useErrorAction,
    (state, action) => customerAdapter.setOne<CustomerState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
