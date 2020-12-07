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
      canAccessDeal: new FormControl(false),
      canGetAllDeal: new FormControl(false),
      canAssignDeal: new FormControl(false),
      canCreateDeal: new FormControl(false),
      canUpdateDeal: new FormControl(false),
      canRemoveDeal: new FormControl(false),
      canCreateProcess: new FormControl(false),
      canUpdateProcess: new FormControl(false),
      canRemoveProcess: new FormControl(false),
      canAccessRole: new FormControl(false),
      canAccessCustomer: new FormControl(false),
      canAssignCustomer: new FormControl(false),
      canGetAllCustomer: new FormControl(false),
      canCreateCustomer: new FormControl(false),
      canUpdateCustomer: new FormControl(false),
      canRemoveCustomer: new FormControl(false),
      canImportCustomer: new FormControl(false),
      canAssignActivity: new FormControl(false),
      canGetAllActivity: new FormControl(false),
      canAccessTicket: new FormControl(false),
      canGetTicketDeal: new FormControl(false),
      canGetTicketSupport: new FormControl(false),
      canUpdateTicket: new FormControl(false),
      canRemoveTicket: new FormControl(false),
      canImportTicket: new FormControl(false),
      canAccessProduct: new FormControl(false),
      canCreateProduct: new FormControl(false),
      canUpdateProduct: new FormControl(false),
      canRemoveProduct: new FormControl(false),
      canImportProduct: new FormControl(false),
      canAccessEvent: new FormControl(false),
      canCreateEvent: new FormControl(false),
      canUpdateEvent: new FormControl(false),
      canRemoveEvent: new FormControl(false),
      canImportEvent: new FormControl(false),
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
            this.toastrService.success('', 'Save role successful!', { duration: 3000 });
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
