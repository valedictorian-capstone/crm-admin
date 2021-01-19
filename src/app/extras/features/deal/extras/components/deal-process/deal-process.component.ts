import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PipelineVM } from '@view-models';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-deal-process',
  templateUrl: './deal-process.component.html',
  styleUrls: ['./deal-process.component.scss']
})
export class DealProcessComponent {
  @Output() useSelectProcess: EventEmitter<PipelineVM> = new EventEmitter<PipelineVM>();
  @Input() isMain: boolean;
  selectedProcess = new FormControl(undefined);
  ngOnInit() {
    this.selectedProcess.valueChanges.pipe(
      tap((data) => {
        this.useSelectProcess.emit(data);
      })
    ).subscribe();
  }
}
