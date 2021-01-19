import { createAction, props } from '@ngrx/store';
import { AccountVM, CampaignCM, CampaignUM, CampaignVM } from '@view-models';
const FindAllAction = createAction(
  '[Campaign] Fetch Action',
  props<{
    success?: (res: CampaignVM[]) => void,
    error?: (err: Error) => void,
    finalize?: () => void,
  }>()
);
const FindAllSuccessAction = createAction(
  '[Campaign] Fetch Action Success',
  props<{ res: CampaignVM[] }>()
);
const SaveSuccessAction = createAction(
  '[Campaign] Save Success Action',
  props<{ res: CampaignVM }>()
);
const RemoveSuccessAction = createAction(
  '[Campaign] Remove Success Action',
  props<{ id: string }>()
);
const SocketAction = createAction(
  '[Campaign] Socket Action',
);
const ListAction = createAction(
  '[Campaign] List Action',
  props<{ res: CampaignVM[] }>()
);
const ResetAction = createAction(
  '[Campaign] Reset Action',
);
export const CampaignAction = {
  FindAllAction,
  FindAllSuccessAction,
  SaveSuccessAction,
  RemoveSuccessAction,
  SocketAction,
  ResetAction,
  ListAction
};
