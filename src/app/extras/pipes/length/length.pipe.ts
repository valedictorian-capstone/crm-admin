import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class LengthPipe implements PipeTransform {

  transform(value: string, length: number): string {
    value = value ? value : '';
    return value.length <= length ? value : value.substring(0, length - 1) + '...';
  }

}
