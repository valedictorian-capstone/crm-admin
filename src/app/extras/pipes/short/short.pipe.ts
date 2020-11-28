import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short'
})
export class ShortPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) {
      return '';
    }
    const tmp = value.split(' ');
    if (tmp.length > 0) {
      let rs = '';
      for (let i = 0; i < tmp.length; i++) {
        const element = tmp[i];
        if (i === tmp.length - 1) {
          rs += element;
        } else {
          rs += element.substring(0, 1) + '.';
        }
      }
      return rs;
    } else {
      return value;
    }
  }

}
