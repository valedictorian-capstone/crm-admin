import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { AccountState } from '@states';
import { AccountVM } from '@view-models';
export const accountAdapter: EntityAdapter<AccountVM> = createEntityAdapter<AccountVM>();

export const accountInitialState: AccountState = accountAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
  unique: undefined,
});
