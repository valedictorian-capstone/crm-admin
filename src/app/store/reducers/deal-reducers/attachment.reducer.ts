import { AttachmentAction } from '@actions';
import { attachmentAdapter, attachmentInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { AttachmentState } from '@states';
export const attachmentFeatureKey = 'attachment';
export const attachmentReducer = createReducer(
  attachmentInitialState,
  on(AttachmentAction.useFindAllAction,
    (state, action) => attachmentAdapter.setAll<AttachmentState>([], {
      ...state,
      status: action.status
    })
  ),
  on(AttachmentAction.useFindAllSuccessAction,
    (state, action) => attachmentAdapter.setAll<AttachmentState>(action.attachments, {
      ...state,
      status: action.status
    })
  ),
  on(AttachmentAction.useUpdateAction,
    (state, action) => attachmentAdapter.setOne<AttachmentState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AttachmentAction.useUpdateSuccessAction,
    (state, action) => attachmentAdapter.updateOne<AttachmentState>({
      id: action.attachment.id,
      changes: action.attachment
    }, state)
  ),
  on(AttachmentAction.useCreateAction,
    (state, action) => attachmentAdapter.setOne<AttachmentState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AttachmentAction.useCreateSuccessAction,
    (state, action) => attachmentAdapter.addMany<AttachmentState>(action.attachment, state)
  ),
  on(AttachmentAction.useRemoveAction,
    (state, action) => attachmentAdapter.setOne<AttachmentState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(AttachmentAction.useRemoveSuccessAction,
    (state, action) => attachmentAdapter.removeOne<AttachmentState>(action.id, state)
  ),
  on(AttachmentAction.useResetAction,
    (state, action) => attachmentAdapter.setAll<AttachmentState>(action.attachments, attachmentInitialState)
  ),
  on(AttachmentAction.useErrorAction,
    (state, action) => attachmentAdapter.setOne<AttachmentState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
