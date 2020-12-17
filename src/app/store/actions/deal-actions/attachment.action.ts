import { createAction, props } from '@ngrx/store';
import { AttachmentUM, AttachmentVM } from '@view-models';
const FindAllAction = createAction(
  '[Attachment] Fetch Action',
  props<{
    success?: (res: AttachmentVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Attachment] Fetch Action Success',
  props<{ res: AttachmentVM[] }>()
);
const CreateSuccessAction = createAction(
  '[Attachment] Create Success Action',
  props<{ res: AttachmentVM[] }>()
);
const UpdateSuccessAction = createAction(
  '[Attachment] Update Success Action',
  props<{ res: AttachmentVM }>()
);
const RemoveSuccessAction = createAction(
  '[Attachment] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Attachment] Socket Action',
);
const ListAction = createAction(
  '[Attachment] List Action',
  props<{ res: AttachmentVM[] }>()
);
const ResetAction = createAction(
  '[Attachment] Reset Action',
);
export const AttachmentAction = {
  FindAllAction,
  FindAllSuccessAction,
  CreateSuccessAction,
  UpdateSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ListAction,
  ResetAction
};
