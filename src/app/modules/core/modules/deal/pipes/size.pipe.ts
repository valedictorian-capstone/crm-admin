import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(value: number): any {
    if (value < 1024) {
      return ((value / 1024) * 100).toFixed(2) + ' B';
    }
    if (value >= 1024 && value < 1024 * 1024) {
      return ((value / (1024 * 1024)) * 100).toFixed(2) + ' KB';
    }
    if (value >= 1024 * 1024 && value <= 1024 * 1024 * 1024) {
      return ((value / (1024 * 1024 * 1024)) * 100).toFixed(2) + ' MB';
    }

    if (value >= 1024 * 1024 * 1024 && value <= 1024 * 1024 * 1024 * 1024) {
      return ((value / (1024 * 1024 * 1024 * 1024)) * 100).toFixed(2) + ' GB';
    }
    return '∞';
  }

}
