import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.scss']
})
export class InstanceDetailComponent implements OnInit {

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) {
    this.activatedRoute.params.pipe(
      pluck('id'),
    ).subscribe((id) => {
      if (!id) {
        this.router.navigate(['core/process']);
      }
    });
  }

  ngOnInit() {
  }

}
