import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { RoleState } from '@states';
import { RoleVM } from '@view-models';
export const roleAdapter: EntityAdapter<RoleVM> = createEntityAdapter<RoleVM>();

export const roleInitialState: RoleState = roleAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
