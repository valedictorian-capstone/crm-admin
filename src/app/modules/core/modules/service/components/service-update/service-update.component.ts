import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { ServiceService } from '@services';
import { ServiceVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-service-update',
  templateUrl: './service-update.component.html',
  styleUrls: ['./service-update.component.scss']
})
export class ServiceUpdateComponent implements OnInit {
  @Output() useDone: EventEmitter<ServiceVM> = new EventEmitter<ServiceVM>();
  @Input() serv: ServiceVM;
  form: FormGroup;
  visible = false;
  constructor(
    protected readonly fb: FormBuilder,
    protected readonly dialogService: NbDialogService,
    protected readonly service: ServiceService,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      type: '',
      price: [undefined, [Validators.required]],
      description: '',
      parameters: fb.array([]),
    });
  }

  ngOnInit() {
  }

  newForm = () => {
    this.form.reset({ name: this.serv.name, description: this.serv.description, type: this.serv.type, price: this.serv.price });
    (this.form.get('parameters') as FormArray).clear();
    for (const parameter of this.serv.parameters) {
      (this.form.get('parameters') as FormArray).push(this.fb.group({
        label: [parameter.label, Validators.required],
        value: [parameter.value, Validators.required],
      }));
    }
    console.log(this.form);
  }

  open(dialog: TemplateRef<any>) {
    this.newForm();
    this.dialogService.open(dialog, { dialogClass: 'update-modal' });
  }
  submit = (ref: NbDialogRef<any>) => {
    if (this.form.valid) {
      this.service.update({ ...this.serv, ...this.form.value }).subscribe(
        () => {
          ref.close();
          swal.fire('Notification', 'Update service successfully!!', 'success');
          this.useDone.emit({ ...this.serv, ...this.form.value });
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
  addParameter = () => {
    (this.form.get('parameters') as FormArray).push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
    }));
  }
  removeParameter = (index: number) => {
    (this.form.get('parameters') as FormArray).removeAt(index);
  }
}
