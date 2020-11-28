import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '@services';
import { CategoryAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class CategoryEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CategoryService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(categorys => CategoryAction.useFindAllSuccessAction({ categorys, status: action.status })),
          catchError(async (error) => CategoryAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.useCreateAction),
      switchMap(action =>
        this.service.insert(action.category).pipe(
          delay(1000),
          map(category => CategoryAction.useCreateSuccessAction({ category, status: action.status })),
          catchError(async (error) => CategoryAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.useUpdateAction),
      switchMap(action =>
        this.service.update(action.category).pipe(
          delay(1000),
          map(category => CategoryAction.useUpdateSuccessAction({ category, status: action.status })),
          catchError(async (error) => CategoryAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => CategoryAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => CategoryAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
