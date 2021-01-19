import { Component, Input, ElementRef } from '@angular/core';
import { CampaignVM } from '@view-models';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-campaign-export',
  templateUrl: './campaign-export.component.html',
  styleUrls: ['./campaign-export.component.scss']
})
export class CampaignExportComponent {
  @Input() data: CampaignVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Campaign Export');
    XLSX.writeFile(wb, 'campaign-export-' + new Date().getTime() + '.xlsx');
  }
}
