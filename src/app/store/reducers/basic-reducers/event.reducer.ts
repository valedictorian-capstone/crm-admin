import { EventAction } from '@actions';
import { eventAdapter, eventInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { EventState } from '@states';
export const eventFeatureKey = 'event';
export const eventReducer = createReducer(
  eventInitialState,
  on(EventAction.useFindAllAction,
    (state, action) => eventAdapter.setAll<EventState>([], {
      ...state,
      status: action.status
    })
  ),
  on(EventAction.useFindAllSuccessAction,
    (state, action) => eventAdapter.setAll<EventState>(action.events, {
      ...state,
      status: action.status
    })
  ),
  on(EventAction.useUpdateAction,
    (state, action) => eventAdapter.setOne<EventState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(EventAction.useUpdateSuccessAction,
    (state, action) => eventAdapter.updateOne<EventState>({
      id: action.event.id,
      changes: action.event
    }, state)
  ),
  on(EventAction.useCreateAction,
    (state, action) => eventAdapter.setOne<EventState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(EventAction.useCreateSuccessAction,
    (state, action) => eventAdapter.addOne<EventState>(action.event, state)
  ),
  on(EventAction.useRemoveAction,
    (state, action) => eventAdapter.setOne<EventState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(EventAction.useRemoveSuccessAction,
    (state, action) => eventAdapter.removeOne<EventState>(action.id, state)
  ),
  on(EventAction.useResetAction,
    (state, action) => eventAdapter.setAll<EventState>(action.events, eventInitialState)
  ),
  on(EventAction.useErrorAction,
    (state, action) => eventAdapter.setOne<EventState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
