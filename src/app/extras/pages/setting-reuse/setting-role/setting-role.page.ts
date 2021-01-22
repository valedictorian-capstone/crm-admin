import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import { DropResult } from 'ngx-smooth-dnd';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

interface ISettingRolePageState {
  form: FormGroup;
  permissions: { name: string, data: { label: string, value: string }[] }[];
}
@Component({
  selector: 'app-reuse-setting-role',
  templateUrl: './setting-role.page.html',
  styleUrls: ['./setting-role.page.scss']
})
export class SettingRolePage implements OnInit, OnDestroy {
  @Input() role: RoleVM;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  subscriptions: Subscription[] = [];
  state: ISettingRolePageState = {
    form: undefined,
    permissions: [
      {
        name: 'Deal',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessDeal'
          },
          {
            label: 'Can Get All',
            value: 'canGetAllDeal'
          },
          {
            label: 'Can Get Feedback',
            value: 'canGetFeedbackDeal'
          },
          {
            label: 'Can Get Assign',
            value: 'canGetAssignDeal'
          },
          {
            label: 'Can Assign',
            value: 'canAssignDeal'
          },
          {
            label: 'Can Create',
            value: 'canCreateDeal'
          },
          {
            label: 'Can Update',
            value: 'canUpdateDeal'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveDeal'
          },
        ]
      },
      {
        name: 'Process',
        data: [
          {
            label: 'Can Create',
            value: 'canCreateProcess'
          },
          {
            label: 'Can Update',
            value: 'canUpdateProcess'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveProcess'
          },
        ]
      },
      {
        name: 'Customer',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessCustomer'
          },
          {
            label: 'Can Create',
            value: 'canCreateCustomer'
          },
          {
            label: 'Can Update',
            value: 'canUpdateCustomer'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveCustomer'
          },
          {
            label: 'Can Import',
            value: 'canImportCustomer'
          },
        ]
      },
      {
        name: 'Role',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessRole'
          },
        ]
      },
      {
        name: 'Activity',
        data: [
          {
            label: 'Can Assign',
            value: 'canAssignActivity'
          },
          {
            label: 'Can Get All',
            value: 'canGetAllActivity'
          },
        ]
      },
      {
        name: 'Ticket',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessTicket'
          },
          {
            label: 'Can Assign Ticket',
            value: 'canAssignTicket'
          },
          {
            label: 'Can Get Feedback Ticket',
            value: 'canGetFeedbackTicket'
          },
          {
            label: 'Can Get Deal Ticket',
            value: 'canGetDealTicket'
          },
          {
            label: 'Can Get Support Ticket',
            value: 'canGetSupportTicket'
          },
          {
            label: 'Can Update',
            value: 'canUpdateTicket'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveTicket'
          },
        ]
      },
      {
        name: 'Employee',
        data: [
          {
            label: 'Can Import',
            value: 'canImportEmployee'
          },
        ]
      },
      {
        name: 'Product',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessProduct'
          },
          {
            label: 'Can Create',
            value: 'canCreateProduct'
          },
          {
            label: 'Can Update',
            value: 'canUpdateProduct'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveProduct'
          },
          {
            label: 'Can Import',
            value: 'canImportProduct'
          },
        ]
      },
      {
        name: 'Event',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessEvent'
          },
          {
            label: 'Can Create',
            value: 'canCreateEvent'
          },
          {
            label: 'Can Update',
            value: 'canUpdateEvent'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveEvent'
          },
        ]
      }
    ]
  };
  constructor(
    protected readonly service: RoleService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    if (this.role) {
      this.useSetData();
    }
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      id: new FormControl(undefined),
      name: new FormControl('', [Validators.required]),
      level: new FormControl(0),
      description: new FormControl(''),
      canAccessDeal: new FormControl(false),
      canGetAllDeal: new FormControl(false),
      canGetFeedbackDeal: new FormControl(false),
      canGetFeedbackTicket: new FormControl(false),
      canGetAssignDeal: new FormControl(false),
      canAssignDeal: new FormControl(false),
      canCreateDeal: new FormControl(false),
      canUpdateDeal: new FormControl(false),
      canRemoveDeal: new FormControl(false),
      canCreateProcess: new FormControl(false),
      canUpdateProcess: new FormControl(false),
      canRemoveProcess: new FormControl(false),
      canAccessRole: new FormControl(false),
      canAccessCustomer: new FormControl(false),
      canAssignTicket: new FormControl(false),
      canCreateCustomer: new FormControl(false),
      canUpdateCustomer: new FormControl(false),
      canRemoveCustomer: new FormControl(false),
      canImportCustomer: new FormControl(false),
      canAssignActivity: new FormControl(false),
      canGetAllActivity: new FormControl(false),
      canAccessTicket: new FormControl(false),
      canGetDealTicket: new FormControl(false),
      canGetSupportTicket: new FormControl(false),
      canUpdateTicket: new FormControl(false),
      canRemoveTicket: new FormControl(false),
      canImportEmployee: new FormControl(false),
      canAccessProduct: new FormControl(false),
      canCreateProduct: new FormControl(false),
      canUpdateProduct: new FormControl(false),
      canRemoveProduct: new FormControl(false),
      canImportProduct: new FormControl(false),
      canAccessEvent: new FormControl(false),
      canCreateEvent: new FormControl(false),
      canUpdateEvent: new FormControl(false),
      canRemoveEvent: new FormControl(false),
    });
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.role.id)
      .pipe(
        tap((data) => {
          this.role = data;
          this.state.form.addControl('id', new FormControl(this.role.id));
          this.state.form.patchValue(this.role);
        }),
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useSubmit = (ref: NbDialogRef<any>) => {
    ref.close();
    if (this.state.form.valid) {
      this.useShowSpinner();
      const subscription = (this.role ? this.service.update({
        ...this.state.form.value,
        level: parseInt(this.state.form.value.level, 0)
      }) : this.service.insert({
        ...this.state.form.value,
        level: parseInt(this.state.form.value.level, 0),
        id: undefined
      }))
        .pipe(
          tap((data) => {
            this.useDone.emit(data);
            this.toastrService.success('', 'Save role successful!', { duration: 3000 });
            this.useClose.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Save role fail! ' + err.error.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useHideSpinner();
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    } else {
      this.state.form.markAsUntouched();
      this.state.form.markAsTouched();
    }
  }
  useShowSpinner = () => {
    this.spinner.show('setting-role');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('setting-role');
    }, 1000);
  }
  useMinusLevel = () => {
    if (this.state.form.get('level').value > 1) {
      this.state.form.get('level').setValue(this.state.form.get('level').value - 1);
    }
  }
  usePlusLevel = () => {
    this.state.form.get('level').setValue(this.state.form.get('level').value + 1);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
