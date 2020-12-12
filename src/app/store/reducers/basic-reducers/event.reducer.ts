import { createReducer, on } from '@ngrx/store';
import { eventAdapter, eventInitialState } from '@adapters';
import { EventAction } from '@actions';
import { EventState } from '@states';
export const eventFeatureKey = 'event';
export const eventReducer = createReducer(
  eventInitialState,
  on(EventAction.FindAllSuccessAction,
    (state, action) => eventAdapter.setAll<EventState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(EventAction.FindAllSuccessAction,
    (state, action) => eventAdapter.setAll<EventState>(action.res, {
      ...state,
    })
  ),
  on(EventAction.SaveSuccessAction,
    (state, action) => eventAdapter.upsertOne<EventState>(action.res, {
      ...state,
    })
  ),
  on(EventAction.RemoveSuccessAction,
    (state, action) => eventAdapter.removeOne<EventState>(action.id, {
      ...state,
    })
  ),
  on(EventAction.ResetAction,
    () => eventAdapter.setAll<EventState>([], eventInitialState)
  ),
);
