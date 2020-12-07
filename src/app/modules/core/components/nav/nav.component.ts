import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AccountVM } from '@view-models';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnChanges {
  @Input() you: AccountVM;
  categories = [];
  more = [];
  showMore = false;
  active = '';
  constructor(
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    if (this.you) {
      this.more = [];
      this.categories = [];
      const categories = environment.categories.filter((item) => this.useCheckRole(item.can));
      if (categories.length > 5) {
        for (let i = 0; i < 4; i++) {
          this.categories.push(categories[i]);
        }
        for (let i = 4; i < categories.length; i++) {
          this.more.push(categories[i]);
        }
      } else {
        this.categories = categories;
      }
      // this.categories = environment.more_categories.filter((item) => this.useCheckRole(item.can));
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.useUpdate();
      }
    });
    this.useUpdate();
  }
  ngOnChanges() {
    if (this.you) {
      this.more = [];
      this.categories = [];
      const categories = environment.categories.filter((item) => this.useCheckRole(item.can));
      if (categories.length > 4) {
        for (let i = 0; i < 3; i++) {
          this.categories.push(categories[i]);
        }
        for (let i = 3; i < categories.length; i++) {
          this.more.push(categories[i]);
        }
      } else {
        this.categories = categories;
      }
      // this.categories = environment.more_categories.filter((item) => this.useCheckRole(item.can));
    }
  }
  useUpdate = (link?: string) => {
    if (link) {
      this.active = link;
      this.router.navigate(['core/' + link]);
    } else {
      this.active = document.location.hash.replace('#/core/', '').split('/')[0];
      this.active = this.active === 'deal' ? 'process' : this.active;
    }
  }
  useCheckRole = (name: string) => {
    return this.you?.roles.filter((role) => role[name]).length > 0;
  }
}
