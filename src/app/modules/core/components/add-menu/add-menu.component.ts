import { Component, OnDestroy, Input } from '@angular/core';
import { GlobalService } from '@services';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent {
  @Input() menus: []
  constructor(
    protected readonly globalService: GlobalService,
  ) {
  }
  useSelect = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: {} });
  }
}
