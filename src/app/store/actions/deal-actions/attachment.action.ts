import { createAction, props } from '@ngrx/store';
import { AttachmentCM, AttachmentUM, AttachmentVM } from '@view-models';
const AttachmentActionType = {
  FIND: {
    FETCH: '[Attachment] Fetch Action',
    SUCCESS: '[Attachment] Fetch Action Success',
  },
  CREATE: {
    FETCH: '[Attachment] Create Action',
    SUCCESS: '[Attachment] Create Action Success',
  },
  UPDATE: {
    FETCH: '[Attachment] Update Action',
    SUCCESS: '[Attachment] Update Action Success',
  },
  REMOVE: {
    FETCH: '[Attachment] Remove Action',
    SUCCESS: '[Attachment] Remove Action Success',
  },
  RESET: {
    FETCH: '[Attachment] Reset Action',
  },
  ERROR: '[Attachment] Action Error',
};
const useFindAllAction = createAction(
  AttachmentActionType.FIND.FETCH,
  props<{ status: string }>()
);
const useFindAllSuccessAction = createAction(
  AttachmentActionType.FIND.SUCCESS,
  props<{ attachments: AttachmentVM[], status: string }>()
);
const useCreateAction = createAction(
  AttachmentActionType.CREATE.FETCH,
  props<{ attachment: FormData, status: string }>()
);
const useCreateSuccessAction = createAction(
  AttachmentActionType.CREATE.SUCCESS,
  props<{ attachment: AttachmentVM[], status: string }>()
);
const useUpdateAction = createAction(
  AttachmentActionType.UPDATE.FETCH,
  props<{ attachment: AttachmentUM, status: string }>()
);
const useUpdateSuccessAction = createAction(
  AttachmentActionType.UPDATE.SUCCESS,
  props<{ attachment: AttachmentVM, status: string }>()
);
const useRemoveAction = createAction(
  AttachmentActionType.REMOVE.FETCH,
  props<{ id: string, status: string }>()
);
const useRemoveSuccessAction = createAction(
  AttachmentActionType.REMOVE.SUCCESS,
  props<{ id: string, status: string }>()
);
const useErrorAction = createAction(
  AttachmentActionType.ERROR,
  props<{ error: string, status: string }>()
);
const useResetAction = createAction(
  AttachmentActionType.RESET.FETCH,
  props<{ attachments: AttachmentVM[] }>()
);
export const AttachmentAction = {
  useFindAllAction,
  useFindAllSuccessAction,
  useCreateAction,
  useCreateSuccessAction,
  useUpdateAction,
  useUpdateSuccessAction,
  useRemoveAction,
  useRemoveSuccessAction,
  useErrorAction,
  useResetAction
};
