import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { CampaignState } from '@states';
import { CampaignVM } from '@view-models';
export const campaignAdapter: EntityAdapter<CampaignVM> = createEntityAdapter<CampaignVM>();

export const campaignInitialState: CampaignState = campaignAdapter.getInitialState({
  ids: [],
  entities: undefined,
  firstLoad: false
});
