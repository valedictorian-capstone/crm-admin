import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  @Input() control: FormControl;
  @Input() group: FormGroup;
  @Input() item: FormControlVM;
  @Input() isDesign?: boolean;
  constructor() { }

  ngOnInit() {
    console.log(this);
  }

}
