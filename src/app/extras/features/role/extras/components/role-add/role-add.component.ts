import { Component, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent {
  @Input() canAdd: boolean;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  useAdd() {
    this.globalService.triggerView$.next({ type: 'role', payload: { } });
  }
}
