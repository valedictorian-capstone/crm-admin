import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { GroupState } from '@states';
import { GroupVM } from '@view-models';
export const groupAdapter: EntityAdapter<GroupVM> = createEntityAdapter<GroupVM>();

export const groupInitialState: GroupState = groupAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
