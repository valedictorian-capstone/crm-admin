import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EntitySelectors } from '@ngrx/entity/src/models';
import { EventState } from '@states';
import { EventVM } from '@view-models';
export const eventAdapter: EntityAdapter<EventVM> = createEntityAdapter<EventVM>();

export const eventInitialState: EventState = eventAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
