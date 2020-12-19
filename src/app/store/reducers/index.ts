import { environment } from '@environments/environment';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import * as fromExtraReducers from './extra-reducers';
import * as fromBasicReducers from './basic-reducers';
import * as fromDealReducers from './deal-reducers';
import { State } from '@states';
import { storeFreeze } from 'ngrx-store-freeze';

export const reducers: ActionReducerMap<State> = {
  router: fromExtraReducers.routerReducer,
  account: fromBasicReducers.accountReducer,
  category: fromBasicReducers.categoryReducer,
  customer: fromBasicReducers.customerReducer,
  device: fromBasicReducers.deviceReducer,
  event: fromBasicReducers.eventReducer,
  comment: fromBasicReducers.commentReducer,
  group: fromBasicReducers.groupReducer,
  notification: fromBasicReducers.notificationReducer,
  product: fromBasicReducers.productReducer,
  role: fromBasicReducers.roleReducer,
  ticket: fromBasicReducers.ticketReducer,
  activity: fromDealReducers.activityReducer,
  log: fromDealReducers.logReducer,
  deal: fromDealReducers.dealReducer,
  attachment: fromDealReducers.attachmentReducer,
  dealDetail: fromDealReducers.dealDetailReducer,
  note: fromDealReducers.noteReducer,
  pipeline: fromDealReducers.pipelineReducer,
  stage: fromDealReducers.stageReducer,
  auth: fromExtraReducers.authReducer,

};
export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export * from './extra-reducers';
export * from './basic-reducers';
export * from './deal-reducers';
