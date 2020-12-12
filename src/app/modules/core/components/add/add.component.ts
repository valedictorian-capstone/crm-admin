import { Component, Input, OnInit } from '@angular/core';
import { AccountVM } from '@view-models';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  toggle = false;
  constructor() { }

  ngOnInit() {
  }
}
