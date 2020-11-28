import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reuse-customer-birthday',
  templateUrl: './customer-birthday.component.html',
  styleUrls: ['./customer-birthday.component.scss']
})
export class CustomerBirthdayComponent implements OnInit {
  @Output() useChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Input() date: Date;
  constructor() { }

  ngOnInit() {
  }

}
