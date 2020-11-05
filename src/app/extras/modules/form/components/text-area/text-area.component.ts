import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormControlVM } from '@view-models';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @Input() control: FormControl;
  @Input() group: FormGroup;
  @Input() item: FormControlVM;
  @Input() isDesign?: boolean;
  constructor() { }

  ngOnInit() {
  }

}
