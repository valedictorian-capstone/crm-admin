import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService, DepartmentService } from '@services';
import { AccountVM, DepartmentVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.scss']
})
export class DepartmentUpdateComponent implements OnInit {
  @Input() department: DepartmentVM;
  @Output() useDone: EventEmitter<DepartmentVM> = new EventEmitter<DepartmentVM>();
  @Output() useClose: EventEmitter<DepartmentVM> = new EventEmitter<DepartmentVM>();
  form: FormGroup;
  accounts: AccountVM[] = [];
  managers: AccountVM[] = [];
  employees: AccountVM[] = [];
  employeeRemove: AccountVM[] = [];
  visible = false;
  search = '';
  model = new FormControl(undefined);
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: DepartmentService,
    protected readonly accountService: AccountService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
      manager: fb.group({
        id: undefined,
        description: undefined,
        accountId: undefined,
      }),
      employees: fb.array([]),
    });
  }

  ngOnInit() {
    this.accountService.findAll().subscribe((data) => {
      const accs = this.department.accountDepartments.map((e) => e.account);
      this.accounts = data.filter((acc) => acc.accountDepartments.length === 0 || accs.find((a) => a.id === acc.id));
      this.managers = data.filter((acc) => acc.accountDepartments.length === 0 || accs.find((a) => a.id === acc.id));
      this.employees = data.filter((acc) => acc.accountDepartments.length === 0 || accs.find((a) => a.id === acc.id));
      this.form.get('manager').get('accountId').valueChanges.subscribe((e) => {
        if (this.form.get('manager').get('accountId').value) {
          this.employees = this.accounts.filter((account) => this.form.get('employees')
            .value.findIndex((employee) => employee.accountId === account.id) === -1
            && account.id !== this.form.get('manager').get('accountId').value);
        }
      });
      this.form.get('employees').valueChanges.subscribe((e) => {
        this.managers = this.accounts.filter((account) => this.form.get('employees')
          .value.findIndex((employee) => employee.accountId === account.id) === -1);
        this.employees = this.accounts.filter((account) => this.form.get('employees')
          .value.findIndex((employee) => employee.accountId === account.id) === -1
          && account.id !== this.form.get('manager').get('accountId').value);
      });
      this.useForm();
    });
  }
  useForm = () => {
    this.form.reset({
      name: this.department.name,
      description: this.department.description,
    });
    this.form.get('manager').reset({
      id: this.department.accountDepartments.find((ad) => ad.isLeader)?.id,
      description: this.department.accountDepartments.find((ad) => ad.isLeader)?.description,
      accountId: this.department.accountDepartments.find((ad) => ad.isLeader)?.account?.id,
    });
    (this.form.get('employees') as FormArray).clear();
    const employees = this.department.accountDepartments.filter((ad) => !ad.isLeader).map((ad) => ({
      id: ad.id,
      description: ad.description,
      accountId: ad.account.id,
    }));
    for (const employee of employees) {
      (this.form.get('employees') as FormArray).push(this.fb.group({
        id: employee.id,
        description: employee.description,
        accountId: employee.accountId,
      }));
    }
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      const accountDepartments = this.form.value.employees.map((employee) => ({
        ...employee,
        account: { id: employee.accountId },
        department: { id: this.department.id },
        accountId: undefined,
        id: employee.id ? employee.id : undefined,
      }));
      if (this.form.value.manager.accountId != null) {
        accountDepartments.push({
          ...this.form.value.manager,
          account: { id: this.form.value.manager.accountId },
          department: { id: this.department.id },
          accountId: undefined,
          isLeader: true,
          id: this.form.value.manager.id ? this.form.value.manager.id : undefined,
        });
      }
      this.service.update({
        id: this.department.id,
        name: this.form.value.name,
        description: this.form.value.description,
        accountDepartments
      })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Update new department successfully!!', 'success');
            this.useDone.emit(data);
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
    } else {
      this.form.markAsTouched();
    }
    // ref.close();
  }
  useInformation = (accountId: string) => {
    return this.accounts.find((account) => account.id === accountId);
  }
  useShortname = (name: string) => {
    const tmp = name.split(' ');
    if (tmp.length > 0) {
      let rs = '';
      for (let i = 0; i < tmp.length; i++) {
        const element = tmp[i];
        if (i === tmp.length - 1) {
          rs += element;
        } else {
          rs += element.substring(0, 1) + '.';
        }
      }
      return rs;
    } else {
      return name;
    }
  }
  useAddEmployee = (accountId: string) => {
    if (accountId) {
      (this.form.get('employees') as FormArray).push(this.fb.group({
        accountId,
        description: undefined
      }));
      this.model.setValue(undefined);
    }
  }
  useRemoveEmployee = (index: number) => {
    (this.form.get('employees') as FormArray).removeAt(index);
  }
}
