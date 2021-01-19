import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CampaignService } from '@services';
import { CampaignAction } from '@actions';
import { catchError, delay, map, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CampaignVM } from '@view-models';

@Injectable()
export class CampaignEffect {
  constructor(
    protected readonly actions$: Actions,
    protected readonly service: CampaignService
  ) { }
  public readonly socket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignAction.SocketAction),

      switchMap(action =>
        this.service.triggerSocket().pipe(
          map(trigger => {

            if (trigger.type === 'create') {
              return CampaignAction.SaveSuccessAction({ res: trigger.data as CampaignVM });
            } else if (trigger.type === 'update') {
              return CampaignAction.SaveSuccessAction({ res: trigger.data as CampaignVM });
            } else if (trigger.type === 'remove') {
              return CampaignAction.RemoveSuccessAction({ id: (trigger.data as CampaignVM).id });
            }
            return CampaignAction.ListAction({ res: [] });
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
      ofType(CampaignAction.FindAllAction),
      switchMap(action =>
        this.service.findAll().pipe(
          map(res => CampaignAction.FindAllSuccessAction({ res })),
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
