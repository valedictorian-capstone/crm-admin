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

interface IRoleSaveState {
  form: FormGroup;
  permissions: { name: string, data: { label: string, value: string }[] }[];
}
interface IRoleSavePayload {
  role: RoleVM;
}
@Component({
  selector: 'app-role-save',
  templateUrl: './role-save.modal.html',
  styleUrls: ['./role-save.modal.scss']
})
export class RoleSaveModal implements OnInit {
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() payload: IRoleSavePayload;
  state: IRoleSaveState = {
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
            label: 'Can Access',
            value: 'canAccessProcess'
          },
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
            label: 'Can Get All Ticket',
            value: 'canGetAllTicket'
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
            label: 'Can Get Feedback Ticket',
            value: 'canGetFeedbackTicket'
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
        name: 'Campaign',
        data: [
          {
            label: 'Can Access',
            value: 'canAccessCampaign'
          },
          {
            label: 'Can Create',
            value: 'canCreateCampaign'
          },
          {
            label: 'Can Update',
            value: 'canUpdateCampaign'
          },
          {
            label: 'Can Remove',
            value: 'canRemoveCampaign'
          },
        ]
      },
    ]
  }
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: RoleService,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly spinner: NgxSpinnerService,
  ) {
    this.useInitForm();
  }
  ngOnInit() {
    if (this.payload.role) {
      this.useSetData();
    }
  }
  useInitForm = () => {
    this.state.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      level: new FormControl(1),
      description: new FormControl(''),
      canAccessDeal: new FormControl(false),
      canGetAllDeal: new FormControl(false),
      canGetAssignDeal: new FormControl(false),
      canGetFeedbackDeal: new FormControl(false),
      canAssignDeal: new FormControl(false),
      canCreateDeal: new FormControl(false),
      canUpdateDeal: new FormControl(false),
      canRemoveDeal: new FormControl(false),

      canAccessTicket: new FormControl(false),
      canGetAllTicket: new FormControl(false),
      canGetDealTicket: new FormControl(false),
      canGetSupportTicket: new FormControl(false),
      canGetFeedbackTicket: new FormControl(false),
      canAssignTicket: new FormControl(false),
      canUpdateTicket: new FormControl(false),
      canRemoveTicket: new FormControl(false),

      canAccessProcess: new FormControl(false),
      canCreateProcess: new FormControl(false),
      canUpdateProcess: new FormControl(false),
      canRemoveProcess: new FormControl(false),

      canAccessRole: new FormControl(false),

      canAccessCustomer: new FormControl(false),
      canCreateCustomer: new FormControl(false),
      canUpdateCustomer: new FormControl(false),
      canRemoveCustomer: new FormControl(false),
      canImportCustomer: new FormControl(false),

      canAssignActivity: new FormControl(false),
      canGetAllActivity: new FormControl(false),

      canAccessProduct: new FormControl(false),
      canCreateProduct: new FormControl(false),
      canUpdateProduct: new FormControl(false),
      canRemoveProduct: new FormControl(false),
      canImportProduct: new FormControl(false),

      canAccessCampaign: new FormControl(false),
      canCreateCampaign: new FormControl(false),
      canUpdateCampaign: new FormControl(false),
      canRemoveCampaign: new FormControl(false),
    });
    this.useCheckChange('canGetAllDeal', ['canGetAssignDeal', 'canGetFeedbackDeal']);
    this.useCheckChange('canGetAssignDeal', ['canGetAllDeal', 'canGetFeedbackDeal']);
    this.useCheckChange('canGetFeedbackDeal', ['canGetAllDeal', 'canGetAssignDeal']);
    this.useCheckChange('canGetAllTicket', ['canGetDealTicket', 'canGetSupportTicket']);
    this.useCheckChange('canGetDealTicket', ['canGetAllTicket', 'canGetSupportTicket']);
    this.useCheckChange('canGetSupportTicket', ['canGetAllTicket', 'canGetDealTicket']);
  }
  useCheckChange(main: string, changes: string[]) {
    this.subscriptions.push(
      this.state.form.get(main).valueChanges
      .pipe(
        tap((data) => {
          if (data) {
            for (let i = 0; i < changes.length; i++) {
              const change = changes[i];
              this.state.form.get(change).setValue(false);
            }
          }
        })
      ).subscribe()
    );
  }
  useSetData = () => {
    this.useShowSpinner();
    const subscription = this.service.findById(this.payload.role.id)
      .pipe(
        tap((data) => {
          this.payload.role = data;
          this.state.form.addControl('id', new FormControl(this.payload.role.id));
          this.state.form.patchValue(this.payload.role);
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
      const subscription = (this.payload.role ? this.service.update({
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
    this.spinner.show('role-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-save');
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
