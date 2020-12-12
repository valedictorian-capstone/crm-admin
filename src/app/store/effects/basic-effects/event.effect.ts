import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EventService } from '@services';
import { EventAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventVM } from '@view-models';

@Injectable()
export class EventEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: EventService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'create') {
              return EventAction.SaveSuccessAction({ res: trigger.data as EventVM });
            } else if (trigger.type === 'update') {
              return EventAction.SaveSuccessAction({ res: trigger.data as EventVM });
            } else if (trigger.type === 'remove') {
              return EventAction.RemoveSuccessAction({ id: (trigger.data as EventVM).id });
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
      ofType(EventAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          tap((data) => console.log('test', data)),

          map(res => EventAction.FindAllSuccessAction({ res })),
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
