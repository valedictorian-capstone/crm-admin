import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pipeline-type',
  templateUrl: './pipeline-type.component.html',
  styleUrls: ['./pipeline-type.component.scss']
})
export class PipelineTypeComponent {
  @Input() type: 'datatable' | 'card';
  @Output() typeChange: EventEmitter<'datatable' | 'card'> = new EventEmitter<'datatable' | 'card'>();
}
