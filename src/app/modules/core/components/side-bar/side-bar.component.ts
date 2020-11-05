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
  categories: Array<
    {
      label: string,
      value: string,
      values?: string[],
      icon: string,
      type: string,
      items?: Array<{ label: string, value: string, icon: string, type: string }>,
      selected?: boolean,
    }
  > = environment.categories;
  active = '';
  constructor(
    protected readonly router: Router,
    protected readonly loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.active = window.location.hash.split('/')[2];
  }

  useLinkPage = (
    item: {
    label: string,
    value: string,
    values?: string[],
    icon: string,
    type: string,
    items?: Array<{ label: string, value: string, icon: string, type: string }>,
    selected?: boolean,
  },
    index: number
  ) => {
    if (item.type === 'item') {
      this.active = item.value;
      this.stick = false;
      this.loadingService.next(true);
      setTimeout(() => {
        this.router.navigate(['core/' + item.value]);
        this.loadingService.next(false);
      }, 500);
    } else {
      for (let i = 0; i < this.categories.length; i++) {
        const element = this.categories[i];
        if (i === index) {
          element.selected = !element.selected;
        } else {
          element.selected = false;
        }
      }
      if (this.active === item.value || item.values.indexOf(this.active) > -1) {
      } else {
        this.active = item.value;
      }
    }
  }

  choosen = (item: {
    label: string,
    value: string,
    values?: string[],
    icon: string,
    type: string,
    items?: Array<{ label: string, value: string, icon: string, type: string }>,
    selected?: boolean,
  }) => {
    if (item.type === 'group') {
      return (this.active === item.value || item.values.indexOf(this.active) > -1) && item.selected;
    } else {
      return this.active === item.value;
    }
  }
  style = (item: {
    label: string,
    value: string,
    values?: string[],
    icon: string,
    type: string,
    items?: Array<{ label: string, value: string, icon: string, type: string }>,
    selected?: boolean,
  }) => {
    if (item.type === 'group') {
      return {
        'margin-bottom':
          ((this.active === item.value || item.values.indexOf(this.active) > -1) && item.selected) ? item.values.length * 3 + 'rem' : '0'
      };
    } else {
      return { 'margin-bottom': '0' };
    }
  }
}
