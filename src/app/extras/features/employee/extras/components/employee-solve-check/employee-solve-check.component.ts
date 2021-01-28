import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { AccountService } from '@services';
import { AccountVM } from '@view-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-solve-check',
  templateUrl: './employee-solve-check.component.html',
  styleUrls: ['./employee-solve-check.component.scss']
})
export class EmployeeSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, employee: AccountVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
  ) {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
