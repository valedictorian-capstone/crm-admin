import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivityService } from '@services';
import { ActivityAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivityVM } from '@view-models';

@Injectable()
export class ActivityEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: ActivityService
  ) { }
  public readonly socket$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ActivityAction.SocketAction),

    switchMap(action =>
      this.service.triggerSocket().pipe(
        map(trigger => {

          const canGetAll = action.requester.roles.filter((role) => role.canGetAllActivity).length > 0;
          if (trigger.type === 'create') {
            if ((trigger.data as ActivityVM).assignee.id === action.requester.id || canGetAll) {
              return ActivityAction.SaveSuccessAction({ res: trigger.data as ActivityVM });
            }
          } else if (trigger.type === 'update') {
            if ((trigger.data as ActivityVM).assignee.id === action.requester.id || canGetAll) {
              return ActivityAction.SaveSuccessAction({ res: trigger.data as ActivityVM });
            } else {
              return ActivityAction.RemoveSuccessAction({ id: (trigger.data as ActivityVM).id });
            }
          } else if (trigger.type === 'remove') {
            return ActivityAction.RemoveSuccessAction({ id: (trigger.data as ActivityVM).id });
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
      ofType(ActivityAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => ActivityAction.FindAllSuccessAction({ res })),
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
