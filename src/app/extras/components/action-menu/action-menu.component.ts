import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ActionMenuItem } from '@extras/models';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  @Input() actions: ActionMenuItem[] = [];
  @Input() template: TemplateRef<any>;
  @Output() useSelectItem: EventEmitter<ActionMenuItem> = new EventEmitter<ActionMenuItem>();
  constructor() { }

  ngOnInit() {
  }

}
