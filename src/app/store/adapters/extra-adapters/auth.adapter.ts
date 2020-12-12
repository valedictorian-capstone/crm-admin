import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AuthState } from '@states';
import { AccountVM } from '@view-models';
export const authAdapter: EntityAdapter<AccountVM> = createEntityAdapter<AccountVM>();

export const authInitialState: AuthState = authAdapter.getInitialState({
  profile: undefined,
});
