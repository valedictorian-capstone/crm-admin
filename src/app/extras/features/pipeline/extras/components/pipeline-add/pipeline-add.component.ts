import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-pipeline-add',
  templateUrl: './pipeline-add.component.html',
  styleUrls: ['./pipeline-add.component.scss']
})
export class PipelineAddComponent {
  @Input() canAdd: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'pipeline', payload: {  } });
  }
}
