import { Pipe, PipeTransform } from '@angular/core';
import { DealDetailVM, DealVM } from '@view-models';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(details: DealDetailVM[] = []): string {
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: 0
    }).format(Number(details.length > 0 ? details
      .map((e) => e.quantity * e.product.price)
      .reduce((p, c) => (p + c)) : 0));
  }

}
