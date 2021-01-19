import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ActivityService, GlobalService } from '@services';
import { ActivityVM, CampaignVM, DealVM } from '@view-models';
import { CalendarEvent } from 'angular-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-activity-card-item',
  templateUrl: './activity-card-item.component.html',
  styleUrls: ['./activity-card-item.component.scss']
})
export class ActivityCardItemComponent implements OnDestroy {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() activity: (CalendarEvent & ActivityVM & { state: string });
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() stage: string;
  @Input() isMain: boolean;
  @Input() for: string;
  @Input() campaign: CampaignVM;
  @Input() deal: DealVM;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  form: FormGroup;
  exist = {
    email: false,
    phone: false,
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: ActivityService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'activity', payload: { activity: this.activity, for: this.activity.campaign ? 'campaign' : (this.activity.deal ? 'deal' : this.for), campaign: this.campaign, deal: this.deal, fix: !this.isMain } });
  }
  useCopy(data: string) {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useIcon = (type: string) => {
    switch (type) {
      case 'email':
        return {
          icon: 'email-outline',
          pack: 'eva'
        };
      case 'call':
        return {
          icon: 'phone-outline',
          pack: 'eva'
        };
      case 'task':
        return {
          icon: 'clock-outline',
          pack: 'eva'
        };
      case 'deadline':
        return {
          icon: 'flag-outline',
          pack: 'eva'
        };
      case 'meetting':
        return {
          icon: 'people-outline',
          pack: 'eva'
        };
      case 'lunch':
        return {
          icon: 'utensils',
          pack: 'font-awesome'
        };
    }
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
