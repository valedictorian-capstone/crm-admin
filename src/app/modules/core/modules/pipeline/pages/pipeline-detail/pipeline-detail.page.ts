import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';
import { GlobalService, PipelineService } from '@services';
import { AccountVM, CustomerVM, PipelineVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, finalize, tap, catchError } from 'rxjs/operators';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector } from '@store/selectors';
import { PipelineAction } from '@store/actions';
import { Subscription, of } from 'rxjs';
interface IPipelineDetailPageState {
  you: AccountVM;
  dragging: boolean;
  restores: PipelineVM[];
  pipelines: PipelineVM[];
  selectedPipeline: PipelineVM;
  search: {
    status: string,
    range: { start: Date, end: Date },
    name: string,
    customer: CustomerVM,
    assignees: [],
  };
  canAssign: boolean;
  canAdd: boolean;
  canUpdate: boolean;
  canRemove: boolean;
  canAddProcess: boolean;
  canUpdateProcess: boolean;
  canRemoveProcess: boolean;
}
@Component({
  selector: 'app-pipeline-detail',
  templateUrl: './pipeline-detail.page.html',
  styleUrls: ['./pipeline-detail.page.scss']
})
export class PipelineDetailPage implements OnInit {
  @ViewChild('newDealRef') newDealRef: TemplateRef<any>;
  subscriptions: Subscription[] = [];
  state: IPipelineDetailPageState = {
    you: undefined,
    pipelines: [],
    restores: [],
    selectedPipeline: undefined,
    search: {
      assignees: [],
      customer: undefined,
      status: '',
      name: '',
      range: undefined
    },
    dragging: false,
    canAssign: false,
    canAdd: false,
    canUpdate: false,
    canRemove: false,
    canAddProcess: false,
    canUpdateProcess: false,
    canRemoveProcess: false,
  }
  constructor(
    protected readonly router: Router,
    protected readonly pipelineService: PipelineService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly dialogService: NbDialogService,
    protected readonly toastrService: NbToastrService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useLoadMine = () => {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.state.you = profile;
              this.state.canAssign = this.state.you.roles.filter((role) => role.canAssignDeal).length > 0;
              this.state.canAdd = this.state.you.roles.filter((role) => role.canCreateDeal).length > 0;
              this.state.canUpdate = this.state.you.roles.filter((role) => role.canUpdateDeal).length > 0;
              this.state.canRemove = this.state.you.roles.filter((role) => role.canRemoveDeal).length > 0;
              this.state.canAddProcess = this.state.you.roles.filter((role) => role.canCreateProcess).length > 0;
              this.state.canUpdateProcess = this.state.you.roles.filter((role) => role.canUpdateProcess).length > 0;
              this.state.canRemoveProcess = this.state.you.roles.filter((role) => role.canRemoveProcess).length > 0;
            }
          })
        )
        .subscribe()
    )
  }
  useRemove = (ref: NbDialogRef<any>) => {
    this.useShowSpinner();
    this.subscriptions.push(
      this.pipelineService.remove(localStorage.getItem('selectedPipeline'))
        .pipe(
          tap(() => {
            this.toastrService.success('', 'Remove process successful', { duration: 3000 });
            localStorage.removeItem('selectedPipeline');
            this.router.navigate(['core/process']);
          }),
          catchError((err) => {
            this.toastrService.success('', 'Remove process fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
            ref.close();
          })
        ).subscribe()
    );
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.pipeline)
      .pipe(
        tap((pipeline) => {
          const firstLoad = pipeline.firstLoad;
          const data = (pipeline.ids as string[]).map((id) => pipeline.entities[id]).filter((pipeline) => !pipeline.isDelete);
          if (!firstLoad) {
            this.router.navigate(['core/process']);
          } else {
            if (data.length === 0) {
              this.router.navigate(['core/process/add']);
            } else {
              this.state.pipelines = data.filter((pipeline) => !pipeline.isDelete);
              this.state.restores = data.filter((pipeline) => pipeline.isDelete);
              if (this.state.pipelines.length === 0) {
                this.router.navigate(['core/process/add']);
              } else {
                if (localStorage.getItem('selectedPipeline') == null) {
                  localStorage.setItem('selectedPipeline', this.state.pipelines[0].id);
                }
                const selected = localStorage.getItem('selectedPipeline');
                this.useSelectPipeline(
                  this.state.pipelines.find((p) => p.id === selected)
                    ? this.state.pipelines.find((p) => p.id === selected)
                    : this.state.pipelines[0]
                  , true);
              }
            }
          }
        })
      ).subscribe()
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(PipelineAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSelectPipeline = async (selected: PipelineVM, reload?: boolean) => {
    if (selected.id !== this.state.selectedPipeline?.id || reload) {
      localStorage.setItem('selectedPipeline', selected.id);
      this.state.selectedPipeline = selected;
    }
  }
  useDialog(template: TemplateRef<any>) {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useAdd = () => {
    this.router.navigate(['core/process/add']);
  }
  useEdit = () => {
    this.router.navigate(['core/process/edit']);
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { pipeline: this.state.selectedPipeline } });
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-detail');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-detail');
  }
  useViewList = () => {
    this.router.navigate(['core/deal']);
  }
  useSearch = (search: {
    status: string,
    range: { start: Date, end: Date },
    name: string,
    customer: CustomerVM,
    assignees: [],
  }) => {
    this.state.search = { ...this.state.search, ...search };
  }
  useRestore = (p: PipelineVM) => {
    this.state.pipelines.push(p);
    this.state.restores = this.state.restores.filter((pipeline) => pipeline.id !== p.id);
  }
}
