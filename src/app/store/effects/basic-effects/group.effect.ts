import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GroupService } from '@services';
import { GroupAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { GroupVM } from '@view-models';

@Injectable()
export class GroupEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: GroupService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(

          map(res => GroupAction.FindAllSuccessAction({ res })),
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
