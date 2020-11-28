import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  categories = environment.more_categories;
  showMore = false;
  active = '';
  constructor(
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.useUpdate();
      }
    });
    this.useUpdate();
  }

  useUpdate = (link?: string) => {
    if (link) {
      this.active = link;
      this.router.navigate(['core/' + link]);
    } else {
      this.active = document.location.hash.replace('#/core/', '').split('/')[0];
    }
  }
}
