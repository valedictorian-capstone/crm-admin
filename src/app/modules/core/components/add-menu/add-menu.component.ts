import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GlobalService } from '@services';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {
  menus = environment.createMenus;
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  ngOnInit() {
  }

  useSelect = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: {} });
  }
}
