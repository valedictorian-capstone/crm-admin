import * as fromRouter from '@ngrx/router-store';
import * as fromNormal from '.';
export * from './extra-states';
export * from './basic-states';
export * from './deal-states';

export interface State {
  router: fromRouter.RouterReducerState;
  account: fromNormal.AccountState;
  comment: fromNormal.CommentState;
  category: fromNormal.CategoryState;
  customer: fromNormal.CustomerState;
  device: fromNormal.DeviceState;
  log: fromNormal.LogState;
  event: fromNormal.EventState;
  group: fromNormal.GroupState;
  notification: fromNormal.NotificationState;
  product: fromNormal.ProductState;
  role: fromNormal.RoleState;
  ticket: fromNormal.TicketState;
  activity: fromNormal.ActivityState;
  attachment: fromNormal.AttachmentState;
  dealDetail: fromNormal.DealDetailState;
  deal: fromNormal.DealState;
  campaign: fromNormal.CampaignState;
  note: fromNormal.NoteState;
  pipeline: fromNormal.PipelineState;
  stage: fromNormal.StageState;
  auth: fromNormal.AuthState;
}
