import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separator'
})
export class SeparatorPipe implements PipeTransform {

  transform(value: string | number): any {
    return new Intl.NumberFormat('en', {
      minimumFractionDigits: 0
    }).format(Number(value));
  }

}
