import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService, PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, finalize } from 'rxjs/operators';

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
  status = '';
  constructor(
    protected readonly router: Router,
    protected readonly pipelineService: PipelineService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  ngOnInit() {
    this.useReload();
  }
  useDelete = (dropResult: DropResult) => {
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
        this.pipelines = data;
        if (data.length === 0) {
          this.router.navigate(['core/process/add']);
        } else {
          const selected = localStorage.getItem('selectedPipeline');
          await this.useSelectPipeline(!(selected || !data.find((p) => p.id === selected)) ? data[0].id : selected, true);
        }
      });
  }
  useSelectPipeline = async (selected: string, reload?: boolean) => {
    if (selected !== this.selectedPipeline?.id || reload) {
      localStorage.setItem('selectedPipeline', selected);
      this.selectedPipeline = await this.pipelineService.findById(selected).toPromise();
    }
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
}
