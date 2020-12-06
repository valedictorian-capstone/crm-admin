import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { PipelineService } from '@services';
import { PipelineVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pipeline-restore',
  templateUrl: './pipeline-restore.component.html',
  styleUrls: ['./pipeline-restore.component.scss']
})
export class PipelineRestoreComponent implements OnInit {
  @Output() useDone: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() pipelines: PipelineVM[] = [];
  constructor(
    protected readonly pipelineService: PipelineService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {
  }

  useRestore = (id: string) => {
    this.useShowSpinner();
    this.pipelineService.restore(id)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      ).subscribe((data) => {
        this.useDone.emit(data);
        this.pipelines = this.pipelines.filter((pipeline) => pipeline.id !== id);
        if (this.pipelines.length === 0) {
          this.useClose.emit();
        }
        this.toastrService.success('', 'Restore process successful', { duration: 3000 });
      }, () => {
        this.toastrService.success('', 'Restore process fail', { duration: 3000 });
      });

  }

  useShowSpinner = () => {
    this.spinner.show('pipeline-restore');
  }
  useHideSpinner = () => {
    this.spinner.hide('pipeline-restore');
  }
}
