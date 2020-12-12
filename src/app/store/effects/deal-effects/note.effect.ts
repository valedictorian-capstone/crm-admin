import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NoteService } from '@services';
import { NoteAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { NoteVM } from '@view-models';

@Injectable()
export class NoteEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: NoteService
  ) { }
  public readonly socket$ = createEffect(() =>
  this.actions$.pipe(
    ofType(NoteAction.SocketAction),
    tap(() => console.log('socket')),
    switchMap(action =>
      this.service.triggerSocket().pipe(
        tap((data) => console.log('test', data)),

        map(trigger => {
          console.log('effect-socket', trigger);
          if (trigger.type === 'create') {
            return NoteAction.SaveSuccessAction({ res: trigger.data as NoteVM });
          } else if (trigger.type === 'update') {
            return NoteAction.SaveSuccessAction({ res: trigger.data as NoteVM });
          } else if (trigger.type === 'remove') {
            return NoteAction.RemoveSuccessAction({ id: (trigger.data as NoteVM).id });
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
      ofType(NoteAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          tap((data) => console.log('test', data)),

          map(res => NoteAction.FindAllSuccessAction({ res })),
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
