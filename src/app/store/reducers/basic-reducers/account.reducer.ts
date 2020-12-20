import { createReducer, on } from '@ngrx/store';
import { accountAdapter, accountInitialState } from '@adapters';
import { AccountAction } from '@actions';
import { AccountState } from '@states';
export const accountFeatureKey = 'account';
export const accountReducer = createReducer(
  accountInitialState,
  on(AccountAction.FindAllSuccessAction,
    (state, action) => {
      return accountAdapter.setAll<AccountState>(action.res, {
        ...state,
        firstLoad: true
      });
    }
  ),
  on(AccountAction.SaveSuccessAction,
    (state, action) => accountAdapter.upsertOne<AccountState>(action.res, {
      ...state,
    })
  ),
  on(AccountAction.RemoveSuccessAction,
    (state, action) => accountAdapter.removeOne<AccountState>(action.id, {
      ...state,
    })
  ),
  on(AccountAction.ResetAction,
    () => accountAdapter.setAll<AccountState>([], accountInitialState)
  ),
);
