import { Component, Input, ElementRef } from '@angular/core';
import { ActivityVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-activity-export',
  templateUrl: './activity-export.component.html',
  styleUrls: ['./activity-export.component.scss']
})
export class ActivityExportComponent {
  @Input() data: ActivityVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Export');
    XLSX.writeFile(wb, 'activity-export-' + new Date().getTime() + '.xlsx');
  }
}
