import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PipelineVM } from '@view-models';

@Component({
  selector: 'app-pipeline-action',
  templateUrl: './pipeline-action.component.html',
  styleUrls: ['./pipeline-action.component.scss']
})
export class PipelineActionComponent implements OnInit {
  @Input() pipelines: PipelineVM[] = [];
  @Input() selectedPipeline: PipelineVM;
  @Output() useAdd: EventEmitter<any> = new EventEmitter<any>();
  @Output() useEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSelect: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  constructor() { }

  ngOnInit() {
  }

}
