import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CampaignState } from '@states';
import { campaignFeatureKey } from '@reducers';
import { campaignAdapter } from '@adapters';
const campaignFeatureSelector = createFeatureSelector<CampaignState>(campaignFeatureKey);
const campaigns = createSelector(campaignFeatureSelector, campaignAdapter.getSelectors().selectAll);
const entities = createSelector(campaignFeatureSelector, campaignAdapter.getSelectors().selectEntities);
const ids = createSelector(campaignFeatureSelector, campaignAdapter.getSelectors().selectIds);
const total = createSelector(campaignFeatureSelector, campaignAdapter.getSelectors().selectTotal);
const firstLoad = createSelector(campaignFeatureSelector, (state) => state.firstLoad);
export const campaignSelector = {
  campaigns,
  entities,
  ids,
  total,
  firstLoad,
};
