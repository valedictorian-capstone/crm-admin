import { EntityState } from '@ngrx/entity';
import { NotificationVM } from '@view-models';

export interface NotificationState extends EntityState<NotificationVM> {
  status: string;
  error: string;
}
