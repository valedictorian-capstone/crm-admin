import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommentService } from '@services';
import { CommentAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommentVM } from '@view-models';

@Injectable()
export class CommentEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CommentService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentAction.SocketAction),
      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {
            if (trigger.type === 'create') {
              return CommentAction.SaveSuccessAction({ res: trigger.data as CommentVM });
            } else if (trigger.type === 'update') {
              return CommentAction.SaveSuccessAction({ res: trigger.data as CommentVM });
            } else if (trigger.type === 'remove') {
              return CommentAction.RemoveSuccessAction({ id: (trigger.data as CommentVM).id });
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
      ofType(CommentAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(

          map(res => CommentAction.FindAllSuccessAction({ res })),
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
