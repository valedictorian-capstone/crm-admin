import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { GlobalService } from '@services';
import { AccountVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { State } from '@store/states';
import { Store } from '@ngrx/store';
import { authSelector } from '@store/selectors';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-role-account',
  templateUrl: './role-account.component.html',
  styleUrls: ['./role-account.component.scss']
})
export class RoleAccountComponent implements OnInit {
  @Output() useToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: AccountVM & { selected?: boolean };
  @Input() level: number;
  @Input() search: string;
  you: AccountVM;
  canUpdate = false;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly toastrService: NbToastrService,
    protected readonly clipboard: Clipboard,
    protected readonly spinner: NgxSpinnerService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly store: Store<State>
  ) {
  }

  ngOnInit() {
    this.useLoadMine();
  }
  useLoadMine = () => {
    this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          this.you = profile;
          this.canUpdate = this.you.roles.filter((role) => role.canAccessRole).length > 0 && Math.min(...this.you.roles.map((e) => e.level)) < Math.min(...this.employee.roles.map((e) => e.level));
        })
      )
      .subscribe()
  }
  useEdit = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee } });
  }
  useView = () => {
    this.globalService.triggerView$.next({ type: 'employee', payload: { employee: this.employee, isProfile: true } });
  }
  usePhone = (phone: string) => {
    window.open('tel:' + phone, '_self');
  }
  useMail = (email: string) => {
    this.globalService.triggerView$.next({ type: 'mail', payload: { email } });
  }
  useCopy = (link: string) => {
    this.clipboard.copy(link);
    this.toastrService.show('', 'Copy successful', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useShowSpinner = () => {
    this.spinner.show('role-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-main');
    }, 1000);
  }
}
