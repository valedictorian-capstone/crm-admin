import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-log-pagination',
  templateUrl: './log-pagination.component.html',
  styleUrls: ['./log-pagination.component.scss']
})
export class LogPaginationComponent {
  @Output() useChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() max: number;
  @Input() active: FormControl;
  min = 1;

  useMin = () => {
    this.active.setValue(this.min);
    this.useChange.emit(this.min);
  }
  useMax = () => {
    this.active.setValue(this.max);
    this.useChange.emit(this.max);
  }
  useActive = (index: string | number) => {
    index = parseInt(index as string);
    if (index <= this.min) {
      this.useMin();
    } else if (index > this.min && index < this.max) {
      this.active.setValue(index);
      this.useChange.emit(index);
    } else {
      this.useMax();
    }
  }
}
