import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '@services';
import { CategoryAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CategoryVM } from '@view-models';

@Injectable()
export class CategoryEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CategoryService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.SocketAction),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            if (trigger.type === 'create') {
              return CategoryAction.SaveSuccessAction({ res: trigger.data as CategoryVM });
            } else if (trigger.type === 'update') {
              return CategoryAction.SaveSuccessAction({ res: trigger.data as CategoryVM });
            } else if (trigger.type === 'remove') {
              return CategoryAction.RemoveSuccessAction({ id: (trigger.data as CategoryVM).id });
            }
            return CategoryAction.ListAction({ res: [] });
          }),
          catchError((error: Error) => {
            return of(undefined);
          }),
        )
      )
    )
  );
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(

          map(res => CategoryAction.FindAllSuccessAction({ res })),
          tap((data) => {
            if (action.success) {
              action.success(data.res)
            }
          }),
          catchError((error: Error) => {
            if (action.error) {
              action.error(error);
            }
            return of(undefined);
          }),
          finalize(() => {
            if (action.finalize) {
              action.finalize();
            }
          })
        )
      )
    )
  );
}
