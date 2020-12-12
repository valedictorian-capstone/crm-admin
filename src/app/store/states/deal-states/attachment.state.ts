import { EntityState } from '@ngrx/entity';
import { AttachmentVM } from '@view-models';

export interface AttachmentState extends EntityState<AttachmentVM> {
  firstLoad: boolean;
}
