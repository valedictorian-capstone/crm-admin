import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Output() useClose: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
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
    this.form.reset({ name: '', description: '' });
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
          swal.fire('Notification', 'Create new role successfully!!', 'success');
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
}
