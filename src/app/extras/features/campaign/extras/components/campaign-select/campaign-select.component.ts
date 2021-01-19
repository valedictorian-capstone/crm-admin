import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CampaignAction } from '@store/actions';
import { State } from '@store/states';
import { CampaignVM } from '@view-models';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
interface ICampaignSelectComponentState {
  search: string;
  array: CampaignVM[];
  filterArray: CampaignVM[];
  status: 'finding' | 'done';
}
@Component({
  selector: 'app-campaign-select',
  templateUrl: './campaign-select.component.html',
  styleUrls: ['./campaign-select.component.scss']
})
export class CampaignSelect1Component implements OnInit, OnDestroy {
  @Input() modelChange: EventEmitter<CampaignVM> = new EventEmitter<CampaignVM>();
  @Input() control: FormControl;
  @Input() model: CampaignVM;
  subscriptions: Subscription[] = [];
  state: ICampaignSelectComponentState = {
    search: '',
    array: [],
    filterArray: [],
    status: 'done',
  }
  constructor(
    protected readonly store: Store<State>,
    protected readonly spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.campaign)
      .pipe(
        tap((campaign) => {
          const firstLoad = campaign.firstLoad;
          const data = (campaign.ids as string[]).map((id) => campaign.entities[id]);
          if (!firstLoad) {
            this.useReload();
          } else {
            this.state.array = data;
            this.useSearch();
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useReload = () => {
    this.useShowSpinner();
    this.store.dispatch(CampaignAction.FindAllAction({
      finalize: () => {
        this.useHideSpinner();
      }
    }));
  }
  useSearch = () => {
    this.state.filterArray = this.state.array.filter((campaign) => campaign.name.toLowerCase().includes(this.state.search.toLowerCase()));
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-select');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-select');
  }
  useSelectItem(item: CampaignVM) {
    if (this.control) {
      this.control.setValue(item);
    }
    this.model = item;
    this.modelChange.emit(item);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
