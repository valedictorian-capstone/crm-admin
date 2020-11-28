import { createReducer, on } from '@ngrx/store';
import { accountAdapter, accountInitialState } from '@adapters';
import { AccountAction } from '@actions';
import { AccountState } from '@states';
export const accountFeatureKey = 'account';
export const accountReducer = createReducer(
  accountInitialState,
  on(AccountAction.useFindAllAction,
    (state, action) => accountAdapter.setAll<AccountState>([], {
      ...state,
      status: action.status
    })
  ),
  on(AccountAction.useFindAllSuccessAction,
    (state, action) => accountAdapter.setAll<AccountState>(action.accounts, {
      ...state,
      status: action.status
    })
  ),
  on(AccountAction.useUpdateAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AccountAction.useUpdateSuccessAction,
    (state, action) => accountAdapter.updateOne<AccountState>({
      id: action.account.id,
      changes: action.account
    }, state)
  ),
  on(AccountAction.useCreateAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AccountAction.useCreateSuccessAction,
    (state, action) => accountAdapter.addOne<AccountState>(action.account, state)
  ),
  on(AccountAction.useRemoveAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AccountAction.useRemoveSuccessAction,
    (state, action) => accountAdapter.removeOne<AccountState>(action.id, state)
  ),
  on(AccountAction.useResetAction,
    (state, action) => accountAdapter.setAll<AccountState>(action.accounts, accountInitialState)
  ),
  on(AccountAction.useUniqueAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: action.status,
      unique: {
        label: action.data.label,
        value: action.data.value,
        exist: false,
      }
    }),
  ),
  on(AccountAction.useUniqueSuccessAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: 'done',
      unique: {
        ...state.unique,
        exist: action.result,
      }
    })
  ),
  on(AccountAction.useErrorAction,
    (state, action) => accountAdapter.setOne<AccountState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
