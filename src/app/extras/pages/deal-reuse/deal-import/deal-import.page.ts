import { Component, Input, OnInit } from '@angular/core';
import { DealVM } from '@view-models';

@Component({
  selector: 'app-deal-import',
  templateUrl: './deal-import.page.html',
  styleUrls: ['./deal-import.page.scss']
})
export class DealImportPage implements OnInit {
  @Input() data: DealVM[];
  constructor() { }

  ngOnInit() {
  }

}
