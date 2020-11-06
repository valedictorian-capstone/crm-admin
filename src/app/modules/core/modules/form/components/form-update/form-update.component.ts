import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { FormGroupService } from '@services';
import { FormControlCM, FormControlVM, FormGroupVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-group-update',
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.scss']
})
export class FormUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<FormGroupVM> = new EventEmitter<FormGroupVM>();
  @Output() useClose: EventEmitter<FormGroupVM> = new EventEmitter<FormGroupVM>();
  // tslint:disable-next-line: variable-name
  @Input() _form: FormGroupVM;
  form: FormGroup;
  visible = false;
  tool = true;
  load = false;
  controls: FormControlCM[] = [];
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: FormGroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
      formControls: fb.array([]),
    });
    this.controls = environment.controls.map((control) => ({
      id: Array(36).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join(''),
      name: control.type + ' control',
      description: '',
      placeHolder: '',
      fontSize: '',
      size: '',
      options: fb.array([]),
      validator: [],
      type: control.type,
      subType: control.subtype,
      width: '',
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      xxl: 24,
      height: '',
      isCapitialize: false,
      tooltip: '',
      label: '',
      color: '',
      position: 0,
      isDelete: false,
    }));
  }

  ngOnInit() {
    this.useCheck('code');
    this.useForm();
  }
  useForm = () => {
    this.form.reset({ name: this._form.name, description: this._form.description });
    (this.form.get('formControls') as FormArray).clear();
    for (const control of this._form.formControls) {
      this.useAddControl(control);
    }
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert(this.form.value)
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Create new form successfully!!', 'success');
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
  useAddControl = (item: FormControlVM) => {
    (this.form.get('formControls') as FormArray).push(this.fb.group({
      ...item,
      id: Array(36).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join(''),
      name: [item.name, Validators.required]
    }));
  }
  useRemoveControl = (index: number) => {
    (this.form.get('formControls') as FormArray).removeAt(index);
  }
  useDrop = (event) => {
    console.log(event);
  }
  useDropControl = (event: CdkDragDrop<FormControlVM[]>) => {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.useAddControl(event.previousContainer.data[event.previousIndex]);
      moveItemInArray(event.container.data, (this.form.get('formControls') as FormArray).length - 1, event.currentIndex);
    }

  }
  useAddOption = (array: FormArray) => {
    array.push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
    }));
    console.log(array);
  }
  useRemoveOption = (array: FormArray, index: number) => {
    array.removeAt(index);

  }
}
