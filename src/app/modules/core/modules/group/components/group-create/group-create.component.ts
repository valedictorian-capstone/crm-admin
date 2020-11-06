import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '@services';
import { GroupVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent implements OnInit {
  @Output() useDone: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Output() useClose: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: GroupService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: '',
    });
  }

  ngOnInit() {
    this.useForm();
    console.log('new');
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
            swal.fire('Notification', 'Create new group successfully!!', 'success');
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
