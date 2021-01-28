import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DealService } from '@services';
import { AccountVM, DealVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { authSelector } from '@store/selectors';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
@Component({
  selector: 'app-deal-solve-check',
  templateUrl: './deal-solve-check.component.html',
  styleUrls: ['./deal-solve-check.component.scss']
})
export class DealSolveCheckComponent {
  @Input() checkList: { formControl: FormControl, deal: DealVM }[] = [];
  you: AccountVM;
  canAssign: boolean;
  subscriptions: Subscription[] = [];
  assignee = new FormControl(undefined, [Validators.required]);
  constructor(
    protected readonly service: DealService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly toastrService: NbToastrService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  useLoadMine() {
    this.subscriptions.push(
      this.store.select(authSelector.profile)
        .pipe(
          tap((profile) => {
            if (profile) {
              this.you = profile;
              this.canAssign = this.you.roles.filter((role) => role.canAssignDeal).length > 0;
            }
          })
        )
        .subscribe()
    );
  }
  useAssign() {
    if (this.assignee.valid) {
      this.useShowSpinner();
      this.service.update(this.checkList.map((e) => ({
        id: e.deal.id,
        assignee: { id: this.assignee.value.id },
        assignBy: {id: this.you.id}
      } as any)))
        .pipe(
          tap((data) => {
            swal.fire('Assign successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Assign fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.assignee.setValue(undefined);
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please select assignee!', '', 'warning');
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useShowSpinner = () => {
    this.spinner.show('deal-main');
  }
  useHideSpinner = () => {
    this.spinner.hide('deal-main');
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
