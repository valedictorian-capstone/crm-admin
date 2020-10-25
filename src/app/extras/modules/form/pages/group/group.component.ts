import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupVM } from '@view-models';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnChanges {
  @Input() formGroup: FormGroupVM;
  @Output() useDone: EventEmitter<FormGroupVM> = new EventEmitter<FormGroupVM>();
  protected group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  useSubmit = () => {
    this.useDone.emit(this.group.value);
  }
}
