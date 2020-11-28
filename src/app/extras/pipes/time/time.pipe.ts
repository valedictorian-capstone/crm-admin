import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  pure: false
})
export class TimePipe implements PipeTransform {

  transform(value: string | Date, now = new Date()): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    value = new Date(value);
    const valueHour = value.getTime() / (1000 * 60 * 60);
    const nowHour = now.getTime() / (1000 * 60 * 60);
    if (nowHour - valueHour <= 24) {
      return 'Today' + ' at ' +
        (value.getHours() < 12 ? value.getHours() : (value.getHours() / 12).toFixed(0)) + ':' + value.getMinutes() + ' ' +
        (value.getHours() < 12 ? 'AM' : 'PM');
    }
    if (nowHour - valueHour > 24 && nowHour - valueHour <= 48) {
      return 'Yesterday' + ' at ' +
        (value.getHours() < 12 ? value.getHours() : (value.getHours() / 12).toFixed(0)) + ':' + value.getMinutes() + ' ' +
        (value.getHours() < 12 ? 'AM' : 'PM');
    }

    if (nowHour - valueHour > 48 && nowHour - valueHour <= 168) {
      return 'Last ' + days[value.getDay()] + ' at ' +
        (value.getHours() < 12 ? value.getHours() : (value.getHours() / 12).toFixed(0)) + ':' + value.getMinutes() + ' ' +
        (value.getHours() < 12 ? 'AM' : 'PM');
    }
    if (nowHour - valueHour > 168) {
      return (value.getFullYear() === new Date().getFullYear()
        ? ''
        : (value.getFullYear() + ' '))
        + months[value.getMonth()] + ' ' + value.getDate() + ' at ' +
        (value.getHours() < 12 ? value.getHours() : (value.getHours() / 12).toFixed(0)) + ':' + value.getMinutes() + ' ' +
        (value.getHours() < 12 ? 'AM' : 'PM');
    }
  }

}
