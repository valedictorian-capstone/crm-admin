import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { CustomerService } from '@services';
import { CustomerVM, District, GroupVM, Province } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-opportunity-create',
  templateUrl: './opportunity-create.component.html',
  styleUrls: ['./opportunity-create.component.scss']
})
export class OpportunityCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<CustomerVM> = new EventEmitter<CustomerVM>();
  @Output() useClose: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Input() groups: GroupVM[] = [];
  @Input() provinces: Province[] = [];
  form: FormGroup;
  visible = false;
  districts: District[] = [];
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: CustomerService,
  ) {
    this.form = fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required]],
      type: 'opportunity',
      province: undefined,
      district: undefined,
      birthDate: undefined,
      avatar: undefined,
      gender: true,
      groups: [],
    });
  }

  ngOnInit() {
    this.useForm();
    this.useCheck('phone');
    this.useCheck('email');
    this.useCheck('code');
  }

  useForm = () => {
    this.form.reset({
      fullname: '',
      phone: '',
      email: '',
      code: '',
      type: 'opportunity',
      province: undefined,
      district: undefined,
      birthDate: undefined,
      gender: true,
      avatar: undefined,
      groups: []
    });
    this.districts = [];
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert({ ...this.form.value, groups: this.form.value.groups.map((id) => ({ id })) })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Create new opportunity successfully!!', 'success');
            this.useDone.emit(data);
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
  useSelectProvince = (id: number) => {
    this.districts = this.provinces.find((province) => province.id === id)
      ? this.provinces.find((province) => province.id === id).huyen : [];
    this.form.get('district').setValue(undefined);
  }
}
