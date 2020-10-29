import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { DepartmentService } from '@services';
import { DepartmentVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.scss']
})
export class DepartmentUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<DepartmentVM> = new EventEmitter<DepartmentVM>();
  @Input() department: DepartmentVM;
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: DepartmentService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {

  }

  newForm = () => {
    this.form.reset({ name: this.department.name, description: this.department.description });
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.department, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update department successfully!!', 'success');
          this.useDone.emit({ ...this.department, ...this.form.value });
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
}
