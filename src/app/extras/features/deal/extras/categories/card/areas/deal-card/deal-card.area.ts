import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDealMainState } from '@extras/features/deal';
import { ISort } from '@extras/interfaces';
import { NbToastrService } from '@nebular/theme';
import { DealService } from '@services';
import { CampaignVM, DealVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-deal-card',
  templateUrl: './deal-card.area.html',
  styleUrls: ['./deal-card.area.scss']
})
export class DealCardArea implements OnDestroy {
  @Output() useSortState: EventEmitter<ISort> = new EventEmitter<ISort>();
  @Output() useCheck: EventEmitter<{formControl: FormControl, deal: DealVM}[]> = new EventEmitter<{formControl: FormControl, deal: DealVM}[]>();
  checkList: {formControl: FormControl, deal: DealVM}[] = [];
  @Input() state: IDealMainState;
  @Input() sort: ISort;
  @Input() isMain: boolean;
  @Input() for: 'basic' | 'campaign' = 'basic';
  @Input() campaign: CampaignVM;
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: DealService,
    protected readonly toastrService: NbToastrService,
  ) { }
  ngOnChanges() {
    this.checkList = this.state.paginationArray.map((deal) => ({
      deal,
      formControl: new FormControl(false),
    }))
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  useSort = (sort: { key: string, stage: 'down' | 'up' }) => {
    this.useSortState.emit(sort);
  }
  useItemCheck() {
    this.useCheck.emit(this.checkList.filter((e) => e.formControl.value));
  }
  async useRemove(id: string) {
    const rs = await swal.fire({
      title: 'Remove an deal?',
      text: 'When you click OK button, an deal will be remove out of system and can not backup',
      showCancelButton: true,
    });
    if (rs.isConfirmed) {
      const subscription = this.service.remove(id)
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Remove deal successful', { duration: 3000 });
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Remove deal fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          })
        ).subscribe(console.log);
      this.subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
