import { Component, EventEmitter, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountVM, CustomerVM, ProductVM } from '@view-models';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { authSelector } from '@store/selectors';
interface IImportDataPageState {
  type: string;
  data: (CustomerVM | ProductVM | AccountVM)[];
  you: AccountVM;
  canImportCustomer: boolean;
  canImportEmployee: boolean;
  canImportProduct: boolean;
}
@Component({
  selector: 'app-reuse-import-data',
  templateUrl: './import-data.page.html',
  styleUrls: ['./import-data.page.scss']
})
export class ImportDataPage implements OnInit, OnDestroy {
  @Input() importType: string;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: IImportDataPageState = {
    type: 'customer',
    data: undefined,
    you: undefined,
    canImportProduct: false,
    canImportEmployee: false,
    canImportCustomer: false,
  };
  constructor(
    protected readonly toastrService: NbToastrService,
    public readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
   }
  ngOnInit() {
    if (this.importType) {
      this.state.type = this.importType;
    }
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.state.you = profile;
          this.state.canImportCustomer = this.state.you.roles.filter((role) => role.canImportCustomer).length > 0;
          this.state.canImportEmployee = this.state.you.roles.filter((role) => role.canImportEmployee).length > 0;
          this.state.canImportProduct = this.state.you.roles.filter((role) => role.canImportProduct).length > 0;
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useChange = (file: NzUploadFile) => {
    if (file.name.match(/(.xls|.xlsx)/)) {
      const reader: FileReader = new FileReader();
      reader.onloadend = async () => {
        const bstr: string | ArrayBuffer = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.state.data = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsBinaryString(file as any);
    } else {
      this.toastrService.danger('', 'This file is not follow extendsion', { duration: 3000 });
    }
    return false;
  }
  useShowSpinner = () => {
    this.spinner.show('import-data');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('import-data');
    }, 1000);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
