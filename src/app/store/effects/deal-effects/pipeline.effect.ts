import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PipelineService } from '@services';
import { PipelineAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { PipelineVM } from '@view-models';

@Injectable()
export class PipelineEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: PipelineService
  ) { }
  public readonly socket$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PipelineAction.SocketAction),
    tap(() => console.log('socket')),
    switchMap(action =>
      this.service.triggerSocket().pipe(
        tap((data) => console.log('test', data)),

        map(trigger => {
          console.log('effect-socket', trigger);
          if (trigger.type === 'create') {
            return PipelineAction.SaveSuccessAction({ res: trigger.data as PipelineVM });
          } else if (trigger.type === 'update') {
            return PipelineAction.SaveSuccessAction({ res: trigger.data as PipelineVM });
          } else if (trigger.type === 'remove') {
            return PipelineAction.RemoveSuccessAction({ id: (trigger.data as PipelineVM).id });
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
      ofType(PipelineAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => PipelineAction.FindAllSuccessAction({ res })),
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
