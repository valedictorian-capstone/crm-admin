import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PipelineVM } from '@view-models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pipeline-export',
  templateUrl: './pipeline-export.component.html',
  styleUrls: ['./pipeline-export.component.scss']
})
export class PipelineExportComponent {
  @Input() data: PipelineVM[] = [];
  useExport = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Process Export');
    XLSX.writeFile(wb, 'process-export-' + new Date().getTime() + '.xlsx');
  }
}
