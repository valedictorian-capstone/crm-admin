import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { AccountService } from '@services';
import { State } from '@states';
import { RoleAction } from '@store/actions';
import { authSelector, roleSelector } from '@store/selectors';
import { AccountVM, RoleVM } from '@view-models';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import * as XLSX from 'xlsx';

interface IEmployeeImportPageState {
  formArray: FormArray;
  roles: RoleVM[];
  you: AccountVM;
  level: number;
}
@Component({
  selector: 'app-employee-import',
  templateUrl: './employee-import.page.html',
  styleUrls: ['./employee-import.page.scss']
})
export class EmployeeImportPage implements OnInit, OnChanges, OnDestroy {
  @Input() data: AccountVM[];
  @Output() useChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() useLoading: EventEmitter<any> = new EventEmitter<any>();
  @Output() useUnLoading: EventEmitter<any> = new EventEmitter<any>();
  subscriptions: Subscription[] = [];
  state: IEmployeeImportPageState = {
    formArray: new FormArray([]),
    roles: [],
    you: undefined,
    level: 9999
  }
  constructor(
    protected readonly service: AccountService,
    protected readonly toastrService: NbToastrService,
    protected readonly store: Store<State>
  ) {
    this.useLoadMine();
  }
  ngOnInit() {
    this.useDispatch();
  }
  useDispatch = () => {
    const subscription = this.store.select((state) => state.role)
      .pipe(
        tap((role) => {
          const firstLoad = role.firstLoad;
          const data = (role.ids as string[]).map((id) => role.entities[id]);
          if (!firstLoad) {
            this.store.dispatch(RoleAction.FindAllAction({}));
          } else {
            this.state.roles = data.filter((e) => e.level > this.state.level);
          }
        })
      ).subscribe();
    this.subscriptions.push(subscription);
  }
  useLoadMine = () => {
    const subscription = this.store.select(authSelector.profile)
      .pipe(
        tap((profile) => {
          if (profile) {
            this.state.you = profile;
            this.state.level = Math.min(...this.state.you.roles.map((e) => e.level));
          }
        })
      )
      .subscribe();
    this.subscriptions.push(subscription);
  }
  ngOnChanges() {
    if (this.data) {
      this.state.formArray.clear();
      for (const item of this.data) {
        const group = new FormGroup({
          password: new FormControl(Array(10).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
            .map((x) => x[Math.floor(Math.random() * x.length)]).join('')),
          phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
          phoneStage: new FormControl('done'),
          emailStage: new FormControl('done'),
          codeStage: new FormControl('done'),
          showBirthday: new FormControl(false),
          errorImage: new FormControl(false),
          errorImageMessage: new FormControl(''),
          email: new FormControl('', [Validators.required, Validators.email]),
          fullname: new FormControl(undefined, [Validators.required]),
          code: new FormControl(undefined, [Validators.required]),
          avatar: new FormControl(undefined),
          roles: new FormControl([], [Validators.required]),
        });
        const elements = [];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            elements.push(element);
            if (group.get(key)) {
              group.get(key).setValue(element);
              group.get(key).markAsTouched();
            }
          }
        }
        (group as any).autoCompleteData = elements;
        this.state.formArray.push(group);
      }
    }
  }
  useImport = () => {
    if (this.state.formArray.valid) {
      this.useLoading.emit();
      const subscription = this.service.import(this.state.formArray.controls.map((e) => e.value))
        .pipe(
          tap((data) => {
            this.toastrService.success('', 'Import employees successful!', { duration: 3000 });
            this.useChange.emit();
          }),
          catchError((err) => {
            this.toastrService.danger('', 'Import employees fail! ' + err.message, { duration: 3000 });
            return of(undefined);
          }),
          finalize(() => {
            this.useUnLoading.emit();
          })
        )
        .subscribe();
      this.subscriptions.push(subscription);
    }
  }
  useDownload = (table: ElementRef<any>) => {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    ws['!cols'] = [{ width: 40 }, { width: 40 }, { width: 40 }, { width: 40 }];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Example Import');
    XLSX.writeFile(wb, 'employee-example' + new Date().getTime() + '.xlsx');
  }
  useCheckPhone = (form: FormGroup) => {
    const phone = form.get('phone');
    if (phone.valid) {
      form.get('phoneStage').setValue('querying');
      const subscription = this.service.checkUnique('phone', phone.value)
        .pipe(
          tap((check) => {
            if (check) {
              phone.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              form.get('phoneStage').setValue('done');
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }

  }
  useCheckEmail = (form: FormGroup) => {
    const email = form.get('email');
    if (email.valid) {
      form.get('emailStage').setValue('querying');
      const subscription = this.service.checkUnique('email', email.value)
        .pipe(
          tap((check) => {
            if (check) {
              email.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              form.get('emailStage').setValue('done');
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }
  }
  useCheckCode = (form: FormGroup) => {
    const code = form.get('code');
    if (code.valid) {
      form.get('codeStage').setValue('querying');
      const subscription = this.service.checkUnique('code', code.value)
        .pipe(
          tap((check) => {
            if (check) {
              code.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            setTimeout(async () => {
              form.get('codeStage').setValue('done');
            }, 1000);
          })
        ).subscribe()
      this.subscriptions.push(subscription);
    }
  }
  useSelectImage = (event: any, input: HTMLElement, form: FormGroup) => {
    form.get('errorImage').setValue(false);
    const files: File[] = event.target.files;
    if (files.length > 1) {
      form.get('errorImage').setValue(true);
      form.get('errorImageMessage').setValue('Only one image accepted');
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 2) {
          form.get('errorImage').setValue(true);
          form.get('errorImageMessage').setValue('Only image size less than 2MB accept');
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            form.get('avatar').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        form.get('errorImage').setValue(true);
        form.get('errorImageMessage').setValue('Only one image accepted');
        input.nodeValue = undefined;
      }
    }
  }
  useRemoveItem = (index: number) => {
    this.state.formArray.removeAt(index);
    if (this.state.formArray.length === 0) {
      this.data = undefined;
      this.useChange.emit();
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
