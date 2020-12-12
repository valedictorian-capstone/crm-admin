import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { environment } from '@environments/environment';
import { GlobalService, SearchService } from '@services';
import { ActivityVM, AttachmentVM, CustomerVM, DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  @Output() isSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() value: string;
  menus = environment.filterTabs;
  stage = 'all';
  loading = false;
  data: (DealVM & { searchType: string }
    | CustomerVM & { searchType: string }
    | ActivityVM & { searchType: string }
    | AttachmentVM & { searchType: string })[] = [];
  constructor(
    protected readonly searchService: SearchService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
  ) { }

  ngOnInit() {
  }

  useSearch = (value: string) => {
    if (value?.length > 0) {
      this.isSearch.emit(true);
      this.loading = true;
      this.spinner.show('search-result');
      this.data = [];
      const all = this.stage === 'all';
      this.value = value;
      this.searchService.search(value)
        .pipe(
          finalize(() => {
            setTimeout(() => {
              this.spinner.hide('search-result');
              this.loading = false;
              this.isSearch.emit(false);
            }, 500);
          })
        )
        .subscribe((data) => {
          const rs = all ? data : data.filter((e) => e.type === this.stage);
          for (const e of rs) {
            for (const item of e.data) {
              this.data.push({ ...item, searchType: e.type });
            }
          }
        });
    }
  }
  useSelect = (stage: string) => {
    this.stage = stage;
    this.useSearch(this.value);
  }
  useAll = () => {
    this.stage = 'all';
    this.useSearch(this.value);
  }
  useNoResul = () => {
    return this.stage === 'all' ? ['deal', 'customer', 'activity', 'attachment'] : [this.stage];
  }
  useNoResultSelect = (type: string) => {
    this.globalService.triggerView$.next({ type, payload: {} });
  }
  useIcon = (type: string) => {
    return this.menus.find((e) => e.value === type);
  }
  useField = (type: string) => {
    switch (type) {
      case 'deal':
        return 'title';
      case 'attachment':
        return 'name';
      case 'activity':
        return 'name';
      default:
        return 'fullname';
    }
  }
  useClickItem = (data: DealVM & { searchType: string }
    | CustomerVM & { searchType: string }
    | ActivityVM & { searchType: string }
    | AttachmentVM & { searchType: string }) => {
    switch (data.searchType) {
      case 'attachment':
        window.open((data as AttachmentVM).url, '_blank');
        break;
      case 'customer':
        this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: data } });
        break;
      case 'lead':
        this.globalService.triggerView$.next({ type: 'customer-profile', payload: { customer: data } });
        break;
      case 'activity':
        this.globalService.triggerView$.next({ type: 'activity', payload: { activity: data } });
        break;
      default:
        this.router.navigate(['core/' + data.searchType + '/' + data.id]);
        break;
    }
  }
}
