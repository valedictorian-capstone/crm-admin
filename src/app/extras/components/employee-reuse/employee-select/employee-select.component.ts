import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '@services';
import { AccountVM } from '@view-models';

@Component({
  selector: 'app-reuse-employee-select',
  templateUrl: './employee-select.component.html',
  styleUrls: ['./employee-select.component.scss']
})
export class EmployeeSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<AccountVM> = new EventEmitter<AccountVM>();
  @Output() useNone: EventEmitter<string> = new EventEmitter<string>();
  @Input() selected: AccountVM;
  @Input() template: HTMLElement;
  value = '';
  accounts: AccountVM[] = [];
  filterAccounts: AccountVM[] = [];
  stage = 'finding';
  you = JSON.parse(localStorage.getItem('id'));
  constructor(
    protected readonly accountService: AccountService,
  ) { }

  ngOnInit() {
    console.log(this.you);
    this.accountService.findAll().subscribe((data) => {
      this.accounts = data;
      setTimeout(() => {
        this.stage = 'done';
        this.filterAccounts = data;
      }, 500);
    });
  }

  useChangeValue = (value: string) => {
    this.stage = 'finding';
    setTimeout(() => {
      this.value = value;
      this.filterAccounts = this.accounts.filter((account) => account.fullname.toLowerCase().includes(value.toLowerCase()));
      this.stage = 'done';
    }, 500);
  }
}
