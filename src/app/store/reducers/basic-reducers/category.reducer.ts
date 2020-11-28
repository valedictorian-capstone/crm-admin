import { CategoryAction } from '@actions';
import { categoryAdapter, categoryInitialState } from '@adapters';
import { createReducer, on } from '@ngrx/store';
import { CategoryState } from '@states';
export const categoryFeatureKey = 'category';
export const categoryReducer = createReducer(
  categoryInitialState,
  on(CategoryAction.useFindAllAction,
    (state, action) => categoryAdapter.setAll<CategoryState>([], {
      ...state,
      status: action.status
    })
  ),
  on(CategoryAction.useFindAllSuccessAction,
    (state, action) => categoryAdapter.setAll<CategoryState>(action.categorys, {
      ...state,
      status: action.status
    })
  ),
  on(CategoryAction.useUpdateAction,
    (state, action) => categoryAdapter.setOne<CategoryState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CategoryAction.useUpdateSuccessAction,
    (state, action) => categoryAdapter.updateOne<CategoryState>({
      id: action.category.id,
      changes: action.category
    }, state)
  ),
  on(CategoryAction.useCreateAction,
    (state, action) => categoryAdapter.setOne<CategoryState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CategoryAction.useCreateSuccessAction,
    (state, action) => categoryAdapter.addOne<CategoryState>(action.category, state)
  ),
  on(CategoryAction.useRemoveAction,
    (state, action) => categoryAdapter.setOne<CategoryState>(undefined, {
      ...state,
      status: action.status
    }),
  ),
  on(CategoryAction.useRemoveSuccessAction,
    (state, action) => categoryAdapter.removeOne<CategoryState>(action.id, state)
  ),
  on(CategoryAction.useResetAction,
    (state, action) => categoryAdapter.setAll<CategoryState>(action.categorys, categoryInitialState)
  ),
  on(CategoryAction.useErrorAction,
    (state, action) => categoryAdapter.setOne<CategoryState>(undefined, {
      ...state,
      status: action.status,
      error: action.error
    })
  ),
);
