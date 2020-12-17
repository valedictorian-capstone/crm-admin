import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PipelineService } from '@services';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { DealAction, PipelineAction } from '@store/actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pipeline-loading',
  templateUrl: './pipeline-loading.page.html',
  styleUrls: ['./pipeline-loading.page.scss']
})
export class PipelineLoadingPage implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
    protected readonly pipelineService: PipelineService,
    protected readonly store: Store<State>
  ) {
    spinner.show();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state)
      .pipe(
        tap((state) => {
          const firstLoad = state.pipeline.firstLoad;
          const data = (state.pipeline.ids as string[]).map((id) => state.pipeline.entities[id]).filter((pipeline) => !pipeline.isDelete);
          if (!firstLoad) {
            this.useReload();
          } else {
            if (data.length === 0) {
              this.router.navigate(['core/process/add']);
            } else {
              let selected = localStorage.getItem('selectedPipeline');
              if (!data.find((p) => p.id === selected)) {
                localStorage.setItem('selectedPipeline', data[0].id);
                selected = localStorage.getItem('selectedPipeline');
              }
              const firstLoadDeal = state.deal.firstLoad;
              if (firstLoadDeal) {
                this.router.navigate(['core/process/detail']);
              } else {
                this.store.dispatch(DealAction.FindAllAction({
                  finalize: () => {
                    this.router.navigate(['core/process/detail']);
                  }
                }));
              }
            }
          }
        })
      ).subscribe()
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.store.dispatch(PipelineAction.FindAllAction({}));
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
