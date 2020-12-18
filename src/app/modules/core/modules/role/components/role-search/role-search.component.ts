import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-role-search',
  templateUrl: './role-search.component.html',
  styleUrls: ['./role-search.component.scss']
})
export class RoleSearchComponent {
  @Output() useSearch: EventEmitter<any> = new EventEmitter<any>();
  @Input() search = {
    value: '',
  };
}
