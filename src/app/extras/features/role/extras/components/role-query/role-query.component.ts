import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRoleSearch } from '@extras/features/role';

@Component({
  selector: 'app-role-query',
  templateUrl: './role-query.component.html',
  styleUrls: ['./role-query.component.scss']
})
export class RoleQueryComponent {
  @Input() search: IRoleSearch;
  @Input() isMain: boolean;
  @Output() useSearch: EventEmitter<IRoleSearch> = new EventEmitter<IRoleSearch>();
  useClear = () => {
    this.search = {
      name: '',
    };
    this.useSearch.emit(this.search);
  }
}
