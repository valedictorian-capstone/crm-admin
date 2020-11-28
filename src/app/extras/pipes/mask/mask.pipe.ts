import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: string | number, query: string): string {
    if (!query) {
      return value.toString();
    }
    const regex = new RegExp(query, 'gi');
    return value.toString().replace(regex, `<b class="text-danger">${query}</b>`);
  }

}
