import { createReducer, on } from '@ngrx/store';
import { attachmentAdapter, attachmentInitialState } from '@adapters';
import { AttachmentAction } from '@actions';
import { AttachmentState } from '@states';
export const attachmentFeatureKey = 'attachment';
export const attachmentReducer = createReducer(
  attachmentInitialState,
  on(AttachmentAction.FindAllSuccessAction,
    (state, action) => attachmentAdapter.setAll<AttachmentState>((state.ids as string[]).map((id) => state.entities[id]), {
      ...state,
      firstLoad: true
    })
  ),
  on(AttachmentAction.FindAllSuccessAction,
    (state, action) => attachmentAdapter.setAll<AttachmentState>(action.res, {
      ...state,
    })
  ),
  on(AttachmentAction.CreateSuccessAction,
    (state, action) => attachmentAdapter.addMany<AttachmentState>(action.res, {
      ...state,
    })
  ),
  on(AttachmentAction.UpdateSuccessAction,
    (state, action) => attachmentAdapter.upsertOne<AttachmentState>(action.res, {
      ...state,
    })
  ),
  on(AttachmentAction.RemoveSuccessAction,
    (state, action) => attachmentAdapter.removeOne<AttachmentState>(action.id, {
      ...state,
    })
  ),
  on(AttachmentAction.ResetAction,
    () => attachmentAdapter.setAll<AttachmentState>([], attachmentInitialState)
  ),
);
