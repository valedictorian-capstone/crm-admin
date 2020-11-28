import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'key'
})
export class KeyPipe implements PipeTransform {

  transform(value: string): any {
    const tmp = value.split(' ');
    return tmp.length > 1 ? tmp[0].substring(0, 1) + tmp[tmp.length - 1].substring(0, 1) : tmp[0].substring(0, 1);
  }

}
