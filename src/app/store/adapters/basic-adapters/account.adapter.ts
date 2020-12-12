import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountState } from '@states';
import { AccountVM } from '@view-models';
export const accountAdapter: EntityAdapter<AccountVM> = createEntityAdapter<AccountVM>();

export const accountInitialState: AccountState = accountAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
