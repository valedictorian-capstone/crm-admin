import { AttachmentAction } from '@actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AttachmentService } from '@services';
import { AttachmentVM } from '@view-models';
import { of } from 'rxjs';
import { catchError, delay, finalize, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AttachmentEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: AttachmentService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttachmentAction.SocketAction),
      tap(() => console.log('socket')),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          tap((data) => console.log('test', data)),

          map(trigger => {
            console.log('effect-socket', trigger);
            if (trigger.type === 'list') {
              return AttachmentAction.CreateSuccessAction({ res: trigger.data as AttachmentVM[] });
            } else if (trigger.type === 'update') {
              return AttachmentAction.UpdateSuccessAction({ res: trigger.data as AttachmentVM });
            } else if (trigger.type === 'remove') {
              return AttachmentAction.RemoveSuccessAction({ id: (trigger.data as AttachmentVM).id });
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
      ofType(AttachmentAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          tap((data) => console.log('test', data)),

          map(res => AttachmentAction.FindAllSuccessAction({ res })),
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
