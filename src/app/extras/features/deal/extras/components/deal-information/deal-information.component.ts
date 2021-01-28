import { Component, Input } from '@angular/core';
import { DealService, GlobalService } from '@services';
import { DealVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-deal-information',
  templateUrl: './deal-information.component.html',
  styleUrls: ['./deal-information.component.scss']
})
export class DealInformationComponent {
  @Input() deal: DealVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  show = true;
  constructor(
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'deal', payload: { deal: this.deal, for: 'deal' } });
  }
  useUpdateStatus = (status: string) => {
    this.useShowSpinner();
    this.deal = { ...this.deal };
      this.service.update({
        id: this.deal.id,
        status
      } as any)
        .pipe(
          finalize(() => this.useHideSpinner())
        )
        .subscribe()
  }
  useShowSpinner = () => {
    this.spinner.show('deal-information');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-information');
  }
}
