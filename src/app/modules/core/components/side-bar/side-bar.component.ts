import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { LoadingService } from '@services';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  stick: boolean;
  categories: Array<{ label: string, value: string, icon: string }> = environment.categories;
  active = '';
  constructor(
    protected readonly router: Router,
    protected readonly loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.active = window.location.hash.split('/')[2];
  }

  useLinkPage = (link: string) => {
    this.loadingService.next(true);
    setTimeout(() => {
      this.router.navigate(['core/' + link]);
      this.active = link;
      this.loadingService.next(false);
    }, 500);
  }
}
