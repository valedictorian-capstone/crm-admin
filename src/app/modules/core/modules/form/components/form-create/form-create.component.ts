import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroupService } from '@services';
import { FormControlCM, FormControlVM, FormGroupVM } from '@view-models';
import swal from 'sweetalert2';
@Component({
  selector: 'app-form-group-create',
  templateUrl: './form-create.component.html',
  styleUrls: ['./form-create.component.scss']
})
export class FormCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<FormGroupVM> = new EventEmitter<FormGroupVM>();
  form: FormGroup;
  visible = false;
  tool = true;
  controls: FormControlCM[] = [];
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: FormGroupService,
  ) {
    this.form = fb.group({
      code: ['', [Validators.required]],
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
    this.check('code');
  }

  newForm = () => {
    this.form.reset({ name: '', description: '', code: '' });
    (this.form.get('formControls') as FormArray).clear();
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'create-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    console.log(this.form);
    if (this.form.valid) {
      this.service.insert(this.form.value).subscribe(
        (data) => {
          ref.close();
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
  addControl = (item: FormControlVM) => {
    (this.form.get('formControls') as FormArray).push(this.fb.group({
      ...item,
      id: Array(36).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map((x) => x[Math.floor(Math.random() * x.length)]).join(''),
      name: [item.name, Validators.required]
    }));
  }
  removeControl = (index: number) => {
    (this.form.get('formControls') as FormArray).removeAt(index);
  }
  drop = (event) => {
    console.log(event);
  }
  dropControl = (event: CdkDragDrop<FormControlVM[]>) => {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.addControl(event.previousContainer.data[event.previousIndex]);
      moveItemInArray(event.container.data, (this.form.get('formControls') as FormArray).length - 1, event.currentIndex);
    }

  }
  addOption = (array: FormArray) => {
    array.push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
    }));
    console.log(array);
  }
  removeOption = (array: FormArray, index: number) => {
    array.removeAt(index);

  }
}
