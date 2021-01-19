import { createReducer, on } from '@ngrx/store';
import { campaignAdapter, campaignInitialState } from '@adapters';
import { CampaignAction } from '@actions';
import { CampaignState } from '@states';
export const campaignFeatureKey = 'campaign';
export const campaignReducer = createReducer(
  campaignInitialState,
  on(CampaignAction.FindAllSuccessAction,
    (state, action) => campaignAdapter.setAll<CampaignState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(CampaignAction.SaveSuccessAction,
    (state, action) => campaignAdapter.upsertOne<CampaignState>(action.res, {
      ...state,
    })
  ),
  on(CampaignAction.RemoveSuccessAction,
    (state, action) => campaignAdapter.removeOne<CampaignState>(action.id, {
      ...state,
    })
  ),
  on(CampaignAction.ListAction,
    (state, action) => campaignAdapter.upsertMany<CampaignState>(action.res, {
      ...state,
    })
  ),
  on(CampaignAction.ResetAction,
    () => campaignAdapter.setAll<CampaignState>([], campaignInitialState)
  ),
);
