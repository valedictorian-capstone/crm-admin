import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService, RoleService } from '@services';
import { RoleVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reuse-role-save',
  templateUrl: './role-save.page.html',
  styleUrls: ['./role-save.page.scss']
})
export class RoleSavePage implements OnInit {
  @Input() role: RoleVM;
  @Input() inside: boolean;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  form: FormGroup;
  level = -1;
  permissions = ['Role', 'Employee', 'Deal', 'Customer', 'Activity', 'Ticket', 'Feedback', 'Process', 'Event'].map((role) => ([
    {
      label: 'Access ' + role,
      value: 'canAccess' + role,
    },
    {
      label: 'Create ' + role,
      value: 'canCreate' + role,
    },
    {
      label: 'Update ' + role,
      value: 'canUpdate' + role,
    },
    {
      label: 'Remove ' + role,
      value: 'canRemove' + role,
    },
    {
      label: 'Import ' + role,
      value: 'canImport' + role,
    },
    {
      label: 'Export ' + role,
      value: 'canExport' + role,
    },
  ]));
  constructor(
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly roleService: RoleService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly authService: AuthService,
  ) {
    this.useShowSpinner();
    this.useInitForm();
  }

  ngOnInit() {
    this.useLoadData();
    if (this.role) {
      this.useSetData();
    }
    this.useHideSpinner();
  }
  useLoadData = () => {
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .subscribe((data) => {
        this.level = Math.min(...data.roles.map((e) => e.level));
        this.form.get('level').setValue(this.level + 1);
      });
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: false });
  }
  useInitForm = () => {
    this.form = new FormGroup({
      name: new FormControl(this.role ? this.role.name : '', [Validators.required]),
      notChange: new FormControl(this.role ? this.role.notChange : false),
      level: new FormControl(this.level + 1),
      description: new FormControl(this.role ? this.role.description : ''),
      canAccessRole: new FormControl(this.role ? this.role.canAccessRole : false),
      canCreateRole: new FormControl(this.role ? this.role.canCreateRole : false),
      canUpdateRole: new FormControl(this.role ? this.role.canUpdateRole : false),
      canRemoveRole: new FormControl(this.role ? this.role.canRemoveRole : false),
      canImportRole: new FormControl(this.role ? this.role.canImportRole : false),
      canExportRole: new FormControl(this.role ? this.role.canExportRole : false),

      canAccessEmployee: new FormControl(this.role ? this.role.canAccessEmployee : false),
      canCreateEmployee: new FormControl(this.role ? this.role.canCreateEmployee : false),
      canUpdateEmployee: new FormControl(this.role ? this.role.canUpdateEmployee : false),
      canRemoveEmployee: new FormControl(this.role ? this.role.canRemoveEmployee : false),
      canImportEmployee: new FormControl(this.role ? this.role.canImportEmployee : false),
      canExportEmployee: new FormControl(this.role ? this.role.canExportEmployee : false),

      canAccessDeal: new FormControl(this.role ? this.role.canAccessDeal : false),
      canCreateDeal: new FormControl(this.role ? this.role.canCreateDeal : false),
      canUpdateDeal: new FormControl(this.role ? this.role.canUpdateDeal : false),
      canRemoveDeal: new FormControl(this.role ? this.role.canRemoveDeal : false),
      canImportDeal: new FormControl(this.role ? this.role.canImportDeal : false),
      canExportDeal: new FormControl(this.role ? this.role.canExportDeal : false),

      canAccessActivity: new FormControl(this.role ? this.role.canAccessActivity : false),
      canCreateActivity: new FormControl(this.role ? this.role.canCreateActivity : false),
      canUpdateActivity: new FormControl(this.role ? this.role.canUpdateActivity : false),
      canRemoveActivity: new FormControl(this.role ? this.role.canRemoveActivity : false),
      canImportActivity: new FormControl(this.role ? this.role.canImportActivity : false),
      canExportActivity: new FormControl(this.role ? this.role.canExportActivity : false),

      canAccessCustomer: new FormControl(this.role ? this.role.canAccessCustomer : false),
      canCreateCustomer: new FormControl(this.role ? this.role.canCreateCustomer : false),
      canUpdateCustomer: new FormControl(this.role ? this.role.canUpdateCustomer : false),
      canRemoveCustomer: new FormControl(this.role ? this.role.canRemoveCustomer : false),
      canImportCustomer: new FormControl(this.role ? this.role.canImportCustomer : false),
      canExportCustomer: new FormControl(this.role ? this.role.canExportCustomer : false),

      canAccessProduct: new FormControl(this.role ? this.role.canAccessProduct : false),
      canCreateProduct: new FormControl(this.role ? this.role.canCreateProduct : false),
      canUpdateProduct: new FormControl(this.role ? this.role.canUpdateProduct : false),
      canRemoveProduct: new FormControl(this.role ? this.role.canRemoveProduct : false),
      canImportProduct: new FormControl(this.role ? this.role.canImportProduct : false),
      canExportProduct: new FormControl(this.role ? this.role.canExportProduct : false),

      canAccessTicket: new FormControl(this.role ? this.role.canAccessTicket : false),
      canCreateTicket: new FormControl(this.role ? this.role.canCreateTicket : false),
      canUpdateTicket: new FormControl(this.role ? this.role.canUpdateTicket : false),
      canRemoveTicket: new FormControl(this.role ? this.role.canRemoveTicket : false),
      canImportTicket: new FormControl(this.role ? this.role.canImportTicket : false),
      canExportTicket: new FormControl(this.role ? this.role.canExportTicket : false),

      canAccessFeedback: new FormControl(this.role ? this.role.canAccessFeedback : false),
      canCreateFeedback: new FormControl(this.role ? this.role.canCreateFeedback : false),
      canUpdateFeedback: new FormControl(this.role ? this.role.canUpdateFeedback : false),
      canRemoveFeedback: new FormControl(this.role ? this.role.canRemoveFeedback : false),
      canImportFeedback: new FormControl(this.role ? this.role.canImportFeedback : false),
      canExportFeedback: new FormControl(this.role ? this.role.canExportFeedback : false),

      canAccessProcess: new FormControl(this.role ? this.role.canAccessProcess : false),
      canCreateProcess: new FormControl(this.role ? this.role.canCreateProcess : false),
      canUpdateProcess: new FormControl(this.role ? this.role.canUpdateProcess : false),
      canRemoveProcess: new FormControl(this.role ? this.role.canRemoveProcess : false),
      canImportProcess: new FormControl(this.role ? this.role.canImportProcess : false),
      canExportProcess: new FormControl(this.role ? this.role.canExportProcess : false),

      canAccessEvent: new FormControl(this.role ? this.role.canAccessEvent : false),
      canCreateEvent: new FormControl(this.role ? this.role.canCreateEvent : false),
      canUpdateEvent: new FormControl(this.role ? this.role.canUpdateEvent : false),
      canRemoveEvent: new FormControl(this.role ? this.role.canRemoveEvent : false),
      canImportEvent: new FormControl(this.role ? this.role.canImportEvent : false),
      canExportEvent: new FormControl(this.role ? this.role.canExportEvent : false),
    });
  }
  useSetData = () => {
    this.roleService.findById(this.role.id).subscribe((data) => {
      this.role = data;
      this.form.addControl('id', new FormControl(this.role.id));
      this.form.patchValue(this.role);
    });
  }
  useSubmit = (ref?: NbDialogRef<any>) => {
    if (ref) {
      ref.close();
    }
    if (this.form.valid) {
      this.useShowSpinner();
      setTimeout(() => {
        (this.role ? this.roleService.update(this.form.value) : this.roleService.insert(this.form.value))
          .pipe(
            finalize(() => {
              this.useHideSpinner();
            })
          )
          .subscribe((data) => {
            this.roleService.triggerValue$.next({ type: this.role ? 'update' : 'create', data });
            this.toastrService.success('', 'Save role success!', { duration: 3000 });
            this.useDone.emit(data);
            this.useClose.emit();
          }, (err) => {
            this.toastrService.danger('', 'Save role fail! Something wrong at runtime', { duration: 3000 });
          });
      }, 2000);
    } else {
      this.form.markAsUntouched();
      this.form.markAsTouched();
    }
  }
  useMinusLevel = () => {
    if (this.form.get('level').value > this.level + 1) {
      this.form.get('level').setValue(this.form.get('level').value - 1);
    }
  }
  usePlusLevel = () => {
    this.form.get('level').setValue(this.form.get('level').value + 1);
  }
  useShowSpinner = () => {
    this.spinner.show('role-save');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('role-save');
    }, 1000);
  }
}
