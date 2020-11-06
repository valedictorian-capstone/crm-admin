import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcessService } from '@services';
import { ProcessVM } from '@view-models';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-config-update',
  templateUrl: './config-update.component.html',
  styleUrls: ['./config-update.component.scss']
})
export class ConfigUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<ProcessVM> = new EventEmitter<ProcessVM>();
  @Output() useClose: EventEmitter<ProcessVM> = new EventEmitter<ProcessVM>();
  @Input() process: ProcessVM;
  form: FormGroup;
  visible = false;
  load = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly service: ProcessService,
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
    this.form.reset({ name: this.process.name, description: this.process.description });
  }
  useSubmit = () => {
    if (this.form.valid) {
      this.load = true;
      this.service.insert({...this.process, ...this.form.value})
        .pipe(finalize(() => {
          this.load = false;
        }))
        .subscribe(
          (data) => {
            swal.fire('Notification', 'Update process successfully!!', 'success');
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
