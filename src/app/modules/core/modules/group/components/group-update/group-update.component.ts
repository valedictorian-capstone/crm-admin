import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '@services';
import { GroupVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html',
  styleUrls: ['./group-update.component.scss']
})
export class GroupUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Output() useClose: EventEmitter<GroupVM> = new EventEmitter<GroupVM>();
  @Input() group: GroupVM;
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
  }

  useForm = () => {
    this.form.reset({ name: this.group.name, description: this.group.description });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.update({ ...this.group, ...this.form.value })
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          () => {
            swal.fire('Notification', 'Update group successfully!!', 'success');
            this.useDone.emit({ ...this.group, ...this.form.value });
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
