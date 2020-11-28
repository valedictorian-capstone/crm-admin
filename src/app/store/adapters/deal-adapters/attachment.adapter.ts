import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AttachmentState } from '@states';
import { AttachmentVM } from '@view-models';
export const attachmentAdapter: EntityAdapter<AttachmentVM> = createEntityAdapter<AttachmentVM>();

export const attachmentInitialState: AttachmentState = attachmentAdapter.getInitialState({
  error: undefined,
  status: '',
  ids: [],
  entities: undefined,
});
