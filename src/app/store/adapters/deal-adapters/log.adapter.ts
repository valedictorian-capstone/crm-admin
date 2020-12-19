import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LogState } from '@states';
import { LogVM } from '@view-models';
export const logAdapter: EntityAdapter<LogVM> = createEntityAdapter<LogVM>();

export const logInitialState: LogState = logAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
