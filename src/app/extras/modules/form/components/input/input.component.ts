import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() group: FormGroup;
  @Input() item: FormControlVM;
  @Input() isDesign?: boolean;
  constructor() { }

  ngOnInit() {
  }

}
