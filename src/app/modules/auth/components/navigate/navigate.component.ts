import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    this.useRouting();
  }

  readonly useRouting = () => {
    setTimeout(() => {
      this.router.navigate(['auth/login']);
    }, 2000);
  }
}
