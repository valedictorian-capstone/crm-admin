import { Component, OnInit, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM, GroupVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss']
})
export class LeadCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Input() groups: GroupVM[] = [];
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: CustomerService,
  ) {
    this.form = fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      type: 'lead',
      address: '',
      avatar: undefined,
      gender: true,
      groups: [],
    });
  }

  ngOnInit() {
    this.check('phone');
    this.check('email');
    this.check('code');
  }

  newForm = () => {
    this.form.reset({
      fullname: '', phone: '', email: '', code: '', type: 'lead', address: '', gender: true, avatar: undefined, groups: []
    });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.insert({ ...this.form.value, groups: this.form.value.groups.map((id) => ({ id })) }).subscribe(
        (data) => {
          ref.close();
          swal.fire('Notification', 'Create new lead successfully!!', 'success');
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

  check = async (name: string) => {
    const control = this.form.get(name);
    control.valueChanges.subscribe(async (data) => {
      if (data !== '') {
        const value = await this.service.checkUnique(name, data).toPromise();
        let errors = control.errors;
        if (value) {
          errors = errors == null ? {} : errors;
          errors.unique = true;
        } else {
          if (errors?.unique) {
            delete errors.unique;
          }
        }
        control.setErrors(errors);
      }
    });
  }
  // changeAvatar = (event) => {
  //   console.log(event);
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     this.form.get('avatar').setValue(reader.result);
  //   };
  //   reader.readAsDataURL(event.target.files[0]);
  // }
}
