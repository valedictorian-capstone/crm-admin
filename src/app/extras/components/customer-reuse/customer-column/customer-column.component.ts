import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reuse-customer-column',
  templateUrl: './customer-column.component.html',
  styleUrls: ['./customer-column.component.scss']
})
export class CustomerColumnComponent implements OnInit {
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
