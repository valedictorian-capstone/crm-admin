import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DealService } from '@services';
import { DealVM, DealDetailVM, ProductVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-deal-product',
  templateUrl: './deal-product.component.html',
  styleUrls: ['./deal-product.component.scss']
})
export class DealProductComponent implements OnChanges{
  @Input() deal: DealVM;
  details: FormArray = new FormArray([]);
  show = true;
  showChange = false;
  constructor(
    protected readonly service: DealService,
    protected readonly spinner: NgxSpinnerService,
  ) { }
  ngOnChanges() {
    this.useReset();
  }
  useChange() {
    if (this.details.valid) {
      this.useShowSpinner();
      this.service.update({
        id: this.deal.id, dealDetails: this.details.controls.map((e) => ({
          deal: { id: this.deal.id },
          product: { id: e.value.product.id },
          quantity: parseInt(e.value.quantity),
      })) } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change deal value successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change deal value fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please add more product!', '', 'warning')
    }
  }
  useRemoveDetail = (index: number) => {
    this.details.removeAt(index);
  }
  usePlusDetail = (detail?: DealDetailVM) => {
    const group = new FormGroup({
      product: new FormControl(detail ? detail.product : undefined),
      quantity: new FormControl(detail ? detail.quantity : 1, [Validators.required]),
    });
    if (detail) {
      group.addControl('id', new FormControl(detail.id));
    }
    this.details.push(group);
  }
  useReset() {
    this.details.clear();
    this.deal.dealDetails.forEach((dealDetail) => this.usePlusDetail(dealDetail));
  }
  useShowSpinner = () => {
    this.spinner.show('deal-product');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-product');
  }
}
