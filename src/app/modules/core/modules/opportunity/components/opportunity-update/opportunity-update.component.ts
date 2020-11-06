import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM, District, GroupVM, Province } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-opportunity-update',
  templateUrl: './opportunity-update.component.html',
  styleUrls: ['./opportunity-update.component.scss']
})
export class OpportunityUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Output() useClose: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Input() opportunity: CustomerVM;
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
      fullname: this.opportunity.fullname,
      phone: this.opportunity.phone,
      email: this.opportunity.email,
      province: this.opportunity.province ? parseInt(this.opportunity.province, 0) : undefined,
      district: this.opportunity.district ? parseInt(this.opportunity.district, 0) : undefined,
      birthDate: this.opportunity.birthDate,
      gender: this.opportunity.gender,
      avatar: this.opportunity.avatar,
      groups: this.opportunity.groups.map((group) => (group.id)),
    });
    this.districts = this.form.get('province').value ? (this.provinces.find((province) => province.id === this.form.get('province').value)
      ? this.provinces.find((province) => province.id === this.form.get('province').value).huyen : []) : [];
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({
        ...this.opportunity, ...this.form.value, groups: this.form.value.groups.map((id) => ({ id }))
      })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update ' + this.opportunity.code + ' successfully!!', 'success');
            this.useDone.emit({ ...this.opportunity, ...this.form.value, groups: this.form.value.groups.map((id) => ({ id })) });
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
        if (value && this.opportunity[name] !== data) {
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
