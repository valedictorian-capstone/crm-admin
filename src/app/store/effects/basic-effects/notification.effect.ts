import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService } from '@services';
import { NotificationAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationVM } from '@view-models';

@Injectable()
export class NotificationEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: NotificationService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationAction.SocketAction),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            if (trigger.type === 'create') {
              return NotificationAction.SaveSuccessAction({ res: trigger.data as NotificationVM });
            } else if (trigger.type === 'update') {
              return NotificationAction.SaveSuccessAction({ res: trigger.data as NotificationVM });
            } else if (trigger.type === 'list') {
              return NotificationAction.SeenAllSuccessAction({ res: trigger.data as NotificationVM[] });
            }
            return NotificationAction.ListAction({ res: [] });
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
      ofType(NotificationAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => NotificationAction.FindAllSuccessAction({ res })),
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
