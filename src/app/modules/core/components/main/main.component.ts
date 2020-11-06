import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadingService } from '@services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() useClickOutside: EventEmitter<any> = new EventEmitter<any>();
  status = false;
  constructor(
    protected readonly loadingService: LoadingService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
  ) { }
  points = [];
  categories = [
    {
      label: '',
      value: 'dashboard',
      icon: 'home',
    },
    {
      label: 'Tracking',
      type: 'group',
      icon: 'activity',
    },
    {
      label: 'Group',
      value: 'group',
      icon: 'layers',
    },
    {
      label: 'Lead',
      value: 'lead',
      icon: 'paper-plane',
    },
    {
      label: 'Opportunity',
      value: 'opportunity',
      icon: 'person-add',
    },
    {
      label: 'Contact',
      value: 'contact',
      icon: 'phone',
    },
    {
      label: 'Account',
      value: 'account',
      icon: 'person-done',
    },
    {
      label: 'Department',
      value: 'department',
      icon: 'cube',
    },
    {
      label: 'Employee',
      value: 'employee',
      icon: 'mic',
    },
    {
      label: 'Role',
      value: 'role',
      icon: 'pin',
    },
    {
      label: 'Form',
      value: 'form',
      icon: 'book',
    },
    {
      label: 'Process',
      value: 'process',
      icon: 'browser',
    },
    {
      label: 'Instance',
      value: 'instance',
      icon: 'sync',
    },
    {
      label: 'Service',
      value: 'service',
      icon: 'flash',
    },
    {
      label: 'Strategy',
      value: 'strategy',
      icon: 'volume-up',
    },
    {
      label: 'Event',
      value: 'event',
      icon: 'calendar',
    },
    {
      label: '404',
      value: '404',
      icon: 'alert-triangle'
    }
  ];
  ngOnInit() {
    this.usePoints(window.location.hash.replace('#/core/', ''));
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        this.usePoints(event.urlAfterRedirects.replace('/core/', ''));
      }
    });
    this.loadingService.loadingSubject$.subscribe((data) => {
      this.status = data;
    });
  }
  usePoints = (url: string) => {
    const tmp = url.split('/');
    this.points = tmp.map((e, i) => {
      const point = this.categories.find((categorie) => categorie.value === e)
        ? this.categories.find((categorie) => categorie.value === e) : { label: e, value: e, icon: undefined };
      if (i > 0) {
        point.value = tmp[i - 1] + '/' + point.value;
      }
      return point;
    });
  }
  useGo = (url: string) => {
    this.router.navigate(['core/' + url]);
  }
}
