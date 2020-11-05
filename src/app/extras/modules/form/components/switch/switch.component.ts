import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

  @Input() control: FormControl;
  @Input() group: FormGroup;
  @Input() item: FormControlVM;
  @Input() isDesign?: boolean;
  constructor() { }

  ngOnInit() {
  }

}
