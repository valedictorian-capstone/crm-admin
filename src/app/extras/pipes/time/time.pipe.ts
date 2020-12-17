import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'time',
  pure: false,
})
export class TimePipe implements PipeTransform {

  transform(value: string | Date, now = new Date()): string {
    if (value && value !== '') {
      value = new Date(value);
      if (value.getDate() === now.getDate() && value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear()) {
        return 'Today at ' + new DatePipe('en-US').transform(value, 'HH:mm');
      } else {
        if (value.getFullYear() === now.getFullYear()) {
          return new DatePipe('en-US').transform(value, 'MMM dd') + ' at ' + new DatePipe('en-US').transform(value, 'HH:mm');
        } else {
          return new DatePipe('en-US').transform(value, 'yyyy, MMM dd') + ' at ' + new DatePipe('en-US').transform(value, 'HH:mm');
        }
      }
    } else {
      return '';
    }
  }

}
