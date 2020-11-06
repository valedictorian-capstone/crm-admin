import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM, District, GroupVM, Province } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-lead-update',
  templateUrl: './lead-update.component.html',
  styleUrls: ['./lead-update.component.scss']
})
export class LeadUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Output() useClose: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Input() lead: CustomerVM;
  @Input() groups: GroupVM[] = [];
  @Input() provinces: Province[] = [];
  districts: District[] = [];
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: CustomerService,
  ) {
    this.form = fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      province: undefined,
      district: undefined,
      avatar: undefined,
      birthDate: undefined,
      gender: true,
      groups: [],
    });
  }

  ngOnInit() {
    this.useCheck('phone');
    this.useCheck('email');
    this.useForm();
  }

  useForm = () => {
    this.form.reset({
      fullname: this.lead.fullname,
      phone: this.lead.phone,
      email: this.lead.email,
      province: this.lead.province ? parseInt(this.lead.province, 0) : undefined,
      district: this.lead.district ? parseInt(this.lead.district, 0) : undefined,
      birthDate: this.lead.birthDate,
      gender: this.lead.gender,
      avatar: this.lead.avatar,
      groups: this.lead.groups.map((group) => (group.id)),
    });
    this.districts = this.form.get('province').value ? (this.provinces.find((province) => province.id === this.form.get('province').value)
      ? this.provinces.find((province) => province.id === this.form.get('province').value).huyen : []) : [];
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({
        ...this.lead, ...this.form.value, groups: this.form.value.groups.map((id) => ({ id }))
      })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update ' + this.lead.code + ' successfully!!', 'success');
            this.useDone.emit({ ...this.lead, ...this.form.value, groups: this.form.value.groups.map((id) => ({ id })) });
          },
          (error) => {
            swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
          }
        );
    } else {
      this.form.markAsTouched();
    }
  }

  useCheck = async (name: string) => {
    const control = this.form.get(name);
    control.valueChanges.subscribe(async (data) => {
      if (data !== '') {
        const value = await this.service.checkUnique(name, data).toPromise();
        let errors = control.errors;
        if (value && this.lead[name] !== data) {
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
  useSelectProvince = (id: number) => {
    this.districts = this.provinces.find((province) => province.id === id)
      ? this.provinces.find((province) => province.id === id).huyen : [];
    this.form.get('district').setValue(undefined);
  }
}
