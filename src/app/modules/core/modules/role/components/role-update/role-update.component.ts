import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.scss']
})
export class RoleUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Output() useClose: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() role: RoleVM;
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: RoleService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {
    this.useForm();
  }

  useForm = () => {
    this.form.reset({ name: this.role.name, description: this.role.description });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({ ...this.role, ...this.form.value })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update role successfully!!', 'success');
            this.useDone.emit({ ...this.role, ...this.form.value });
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
