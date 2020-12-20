import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LogService } from '@services';
import { LogAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LogVM } from '@view-models';

@Injectable()
export class LogEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: LogService
  ) { }
  public readonly socket$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LogAction.SocketAction),

    switchMap(action =>
      this.service.triggerSocket().pipe(
        map(trigger => {
          if (trigger.type === 'create') {
            return LogAction.SaveSuccessAction({ res: trigger.data as LogVM });
          } else if (trigger.type === 'update') {
            return LogAction.SaveSuccessAction({ res: trigger.data as LogVM });
          } else if (trigger.type === 'remove') {
            return LogAction.RemoveSuccessAction({ id: (trigger.data as LogVM).id });
          }
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
      ofType(LogAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => LogAction.FindAllSuccessAction({ res })),
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
