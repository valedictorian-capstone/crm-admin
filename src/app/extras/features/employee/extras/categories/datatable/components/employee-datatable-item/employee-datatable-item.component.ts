import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AccountService, GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-datatable-item',
  templateUrl: './employee-datatable-item.component.html',
  styleUrls: ['./employee-datatable-item.component.scss']
})
export class EmployeeDatatableItemComponent implements OnDestroy {
  @Output() useToggleState: EventEmitter<any> = new EventEmitter<any>();
  @Output() useSortable: EventEmitter<any> = new EventEmitter<any>();
  @Output() useRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() useItemCheck: EventEmitter<any> = new EventEmitter<any>();
  @Input() control: FormControl;
  @Input() employee: AccountVM;
  @Input() canUpdate = false;
  @Input() canRemove = false;
  @Input() isHeader = false;
  @Input() search: string;
  @Input() stage: string;
  @Input() isMain: boolean;
  @Input() sort = {
    key: '',
    stage: 'up'
  };
  form: FormGroup;
  exist = {
    email: false,
    phone: false,
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly clipboard: Clipboard,
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly router: Router,
  ) {
  }
  useEdit() {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee, for: 'employee' } });
  }
  useView() {
    this.router.navigate(['core/employee/' + this.employee.id]);
  }
  useCopy(data: string) {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useSort(key: string) {
    if (this.sort.key === key) {
      this.sort.stage = this.sort.stage === 'up' ? 'down' : 'up';
    } else {
      this.sort.key = key;
    }
    this.useSortable.emit(this.sort);
  }
  useRenderRole = () => {
    return this.employee.roles.map((e) => e.name).join(',');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
