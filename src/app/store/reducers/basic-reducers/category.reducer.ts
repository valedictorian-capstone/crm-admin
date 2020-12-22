import { createReducer, on } from '@ngrx/store';
import { categoryAdapter, categoryInitialState } from '@adapters';
import { CategoryAction } from '@actions';
import { CategoryState } from '@states';
export const categoryFeatureKey = 'category';
export const categoryReducer = createReducer(
  categoryInitialState,
  on(CategoryAction.FindAllSuccessAction,
    (state, action) => categoryAdapter.setAll<CategoryState>(action.res, {
      ...state,
      firstLoad: true
    })
  ),
  on(CategoryAction.SaveSuccessAction,
    (state, action) => categoryAdapter.upsertOne<CategoryState>(action.res, {
      ...state,
    })
  ),
  on(CategoryAction.RemoveSuccessAction,
    (state, action) => categoryAdapter.removeOne<CategoryState>(action.id, {
      ...state,
    })
  ),
  on(CategoryAction.ListAction,
    (state, action) => categoryAdapter.upsertMany<CategoryState>(action.res, {
      ...state,
    })
  ),
  on(CategoryAction.ResetAction,
    () => categoryAdapter.setAll<CategoryState>([], categoryInitialState)
  ),
);
