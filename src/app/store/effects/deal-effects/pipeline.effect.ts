import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PipelineService } from '@services';
import { PipelineAction } from '@actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable()
export class PipelineEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: PipelineService
  ) { }
  public readonly find$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineAction.useFindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          delay(1000),
          map(pipelines => PipelineAction.useFindAllSuccessAction({ pipelines, status: action.status })),
          catchError(async (error) => PipelineAction.useErrorAction({ error, status: action.status })),
        )
      )
    )
  );
  public readonly save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineAction.useSaveAction),
      switchMap(action =>
        this.service.save(action.pipeline).pipe(
          delay(1000),
          map(pipeline => PipelineAction.useSaveSuccessAction({ pipeline, status: action.status })),
          catchError(async (error) => PipelineAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
  public readonly remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineAction.useRemoveAction),
      switchMap(action =>
        this.service.remove(action.id).pipe(
          delay(1000),
          map(id => PipelineAction.useRemoveSuccessAction({ id, status: action.status })),
          catchError(async (error) => PipelineAction.useErrorAction({ error, status: action.status })),
        ))
    )
  );
}
