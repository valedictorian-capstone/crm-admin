import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PipelineVM } from '@view-models';

@Component({
  selector: 'app-reuse-pipeline-select',
  templateUrl: './pipeline-select.component.html',
  styleUrls: ['./pipeline-select.component.scss']
})
export class PipelineSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Input() template: HTMLElement;
  @Input() selected: PipelineVM;
  @Input() pipelines: PipelineVM[] = [];
  value = '';
  filterPipelines: PipelineVM[] = [];
  stage = 'done';
  constructor(
  ) { }

  ngOnInit() {
  }

  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterPipelines = this.pipelines.filter((pipeline) => pipeline.name.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);
  }

}
