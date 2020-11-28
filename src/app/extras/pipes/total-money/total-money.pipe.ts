import { Pipe, PipeTransform } from '@angular/core';
import { DealVM, StageVM } from '@view-models';

@Pipe({
  name: 'totalMoney',
  pure: false
})
export class TotalMoneyPipe implements PipeTransform {

  transform(value: DealVM[]): string {
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: 0
    }).format(Number(value && value.length > 0 ? value
      .map((deal) => (deal.dealDetails.length > 0 ? deal.dealDetails
        .map((e) => e.quantity * e.product.price)
        .reduce((p, c) => (p + c)) : 0))
      .reduce((p, c) => (p + c)) : 0));
  }

}
