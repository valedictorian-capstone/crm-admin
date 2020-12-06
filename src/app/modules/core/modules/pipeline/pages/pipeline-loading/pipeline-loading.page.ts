import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PipelineService } from '@services';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-pipeline-loading',
  templateUrl: './pipeline-loading.page.html',
  styleUrls: ['./pipeline-loading.page.scss']
})
export class PipelineLoadingPage implements OnInit {

  constructor(
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
    protected readonly pipelineService: PipelineService,
  ) {
    spinner.show();
  }
  ngOnInit() {
    this.useLoading();
  }
  useLoading = () => {
    setTimeout(() => {
      this.pipelineService.findAll()
        .pipe(
          map((data) => data.filter((pipeline) => !pipeline.isDelete))
        )
        .subscribe((data) => {
          this.spinner.hide();
          if (data.length === 0) {
            this.router.navigate(['core/process/add']);
          } else {
            let selected = localStorage.getItem('selectedPipeline');
            if (!data.find((p) => p.id === selected)) {
              localStorage.setItem('selectedPipeline', data[0].id);
              selected = localStorage.getItem('selectedPipeline');
            }
            this.router.navigate(['core/process/detail']);
          }
        });

    }, 1000);
  }
}
