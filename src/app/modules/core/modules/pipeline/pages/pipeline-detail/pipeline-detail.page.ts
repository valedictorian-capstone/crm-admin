import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';
import { GlobalService, PipelineService } from '@services';
import { AccountVM, PipelineVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, finalize, tap } from 'rxjs/operators';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector } from '@store/selectors';

@Component({
  selector: 'app-pipeline-detail',
  templateUrl: './pipeline-detail.page.html',
  styleUrls: ['./pipeline-detail.page.scss']
})
export class PipelineDetailPage implements OnInit {
  @ViewChild('newDealRef') newDealRef: TemplateRef<any>;
  dragging = false;
  selectedPipeline: PipelineVM;
  pipelines: PipelineVM[] = [];
  restores: PipelineVM[] = [];
  status = '';
  you: AccountVM;
  canAdd = false;
  canUpdate = false;
  canRemove = false;
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
    this.useReload();
  }
  useLoadMine = () => {
    this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.you = profile;
          this.canAdd = this.you.roles.filter((role) => role.canCreateCustomer).length > 0;
          this.canUpdate = this.you.roles.filter((role) => role.canUpdateCustomer).length > 0;
          this.canRemove = this.you.roles.filter((role) => role.canRemoveCustomer).length > 0;
        })
      )
      .subscribe()
  }
  useRemove = (ref: NbDialogRef<any>) => {
    this.useShowSpinner();
    this.pipelineService.remove(localStorage.getItem('selectedPipeline'))
      .pipe(
        finalize(() => {
          this.useHideSpinner();
          ref.close();
        })
      ).subscribe(() => {
        this.toastrService.success('', 'Remove process successful', { duration: 3000 });
        localStorage.removeItem('selectedPipeline');
        this.router.navigate(['core/process']);
      }, () => {
        this.toastrService.success('', 'Remove process fail', { duration: 3000 });
      });
  }
  useReload = () => {
    this.useShowSpinner();
    this.pipelineService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        }),
      )
      .subscribe(async (data) => {
        this.pipelines = data.filter((pipeline) => !pipeline.isDelete);
        this.restores = data.filter((pipeline) => pipeline.isDelete);
        if (this.pipelines.length === 0) {
          this.router.navigate(['core/process/add']);
        } else {
          if (localStorage.getItem('selectedPipeline') == null) {
            localStorage.setItem('selectedPipeline', this.pipelines[0].id);
          }
          const selected = localStorage.getItem('selectedPipeline');
          await this.useSelectPipeline(!this.pipelines.find((p) => p.id === selected)
            ? this.pipelines[0].id : selected, true);
        }
      });
  }
  useSelectPipeline = async (selected: string, reload?: boolean) => {
    if (selected !== this.selectedPipeline?.id || reload) {
      localStorage.setItem('selectedPipeline', selected);
      this.selectedPipeline = await this.pipelineService.findById(selected).toPromise();
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
  useCreateDeal = () => {
    this.globalService.triggerView$.next({ type: 'deal', payload: { pipeline: this.selectedPipeline } });
  }
  useShowSpinner = () => {
    this.spinner.show('pipeline-deatail');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-deatail');
  }
  useViewDeal = () => {
    this.router.navigate(['core/deal']);
  }
  useRestore = (p: PipelineVM) => {
    this.pipelines.push(p);
    this.restores = this.restores.filter((pipeline) => pipeline.id !== p.id);
  }
}
