import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CustomerService, DealService } from '@services';
import { CampaignVM, CustomerVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-customer-solve-check',
  templateUrl: './customer-solve-check.component.html',
  styleUrls: ['./customer-solve-check.component.scss']
})
export class CustomerSolveCheckComponent {
  @Input() campaign: CampaignVM;
  @Input() checkList: { formControl: FormControl, customer: CustomerVM }[] = [];
  pipeline = new FormControl(undefined, [Validators.required]);
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: CustomerService,
    protected readonly dealService: DealService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  useCreateDeal() {
    if (this.pipeline.valid || this.campaign) {
      this.useShowSpinner();
      this.dealService.insert(this.checkList.map((e) => ({
        customer: { id: e.customer.id },
        title: e.customer.fullname + '_' + (this.campaign ? this.campaign.name : 'Deal'),
        status: 'processing',
        campaign: this.campaign,
        stage: this.campaign ? { id: this.campaign.pipeline.stages.find((stage) => stage.position === 0).id } : {id: this.pipeline.value.stages.find((stage) => stage.position ===0 ).id}
      } as any)))
        .pipe(
          tap((data) => {
            swal.fire('Create deal successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Create deal fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.pipeline.setValue(undefined);
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select process!', '', 'warning');
    }
  }
  useShowSpinner = () => {
    this.spinner.show('customer-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('customer-main');
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
