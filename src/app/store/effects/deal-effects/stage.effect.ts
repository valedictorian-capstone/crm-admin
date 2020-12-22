import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StageService } from '@services';
import { StageAction } from '@actions';
import { catchError, delay, finalize, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StageVM } from '@view-models';

@Injectable()
export class StageEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: StageService
  ) { }
  public readonly socket$ = createEffect(() =>
  this.actions$.pipe(
    ofType(StageAction.SocketAction),

    switchMap(action =>
      this.service.triggerSocket().pipe(
        map(trigger => {

          if (trigger.type === 'create') {
            return StageAction.SaveSuccessAction({ res: trigger.data as StageVM });
          } else if (trigger.type === 'update') {
            return StageAction.SaveSuccessAction({ res: trigger.data as StageVM });
          } else if (trigger.type === 'remove') {
            return StageAction.RemoveSuccessAction({ id: (trigger.data as StageVM).id });
          }
          return StageAction.ListAction({ res: [] });
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
      ofType(StageAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => StageAction.FindAllSuccessAction({ res })),
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
