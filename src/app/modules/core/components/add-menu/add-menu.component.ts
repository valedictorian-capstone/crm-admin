import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { environment } from '@environments/environment';
import { GlobalService } from '@services';
import { AccountVM } from '@view-models';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit, OnChanges {
  @Input() you: AccountVM;
  menus = [];
  constructor(
    protected readonly globalService: GlobalService,
  ) { }

  ngOnInit() {
    console.log(this.you);
    if (this.you) {
      this.menus = environment.createMenus.filter((item) => this.useCheckRole(item.can));
      console.log(this.menus);
    }
  }

  ngOnChanges() {
    console.log(this.you);
    if (this.you) {
      this.menus = environment.createMenus.filter((item) => this.useCheckRole(item.can));
      console.log(this.menus);
    }
  }

  useSelect = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: {} });
  }
  useCheckRole = (name: string) => {
    return this.you.roles.filter((role) => role[name]).length > 0;
  }
}
