import { Component, OnChanges, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '@services';
import { CustomerVM } from '@view-models';
import { tap, finalize, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-customer-import-item',
  templateUrl: './customer-import-item.component.html',
  styleUrls: ['./customer-import-item.component.scss']
})
export class CustomerImportItemComponent implements OnInit {
  @Output() useRemoveItem: EventEmitter<any> = new EventEmitter<any>();
  @Input() group: FormGroup;

  constructor(
    protected readonly service: CustomerService,
  ) { }
  async ngOnInit() {
    const phone = this.group.get('phone');
    const email = this.group.get('email');
    if (phone.valid) {
      this.group.get('phoneStage').setValue('querying');
      this.service.checkUnique('phone', phone.value)
        .pipe(
          tap((checkPhone) => {
            if (checkPhone) {
              phone.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            this.group.get('phoneStage').setValue('done');
          })
        ).subscribe();
    }
    if (email.valid) {
      this.group.get('emailStage').setValue('querying');
      this.service.checkUnique('email', email.value)
        .pipe(
          tap((checkPhone) => {
            if (checkPhone) {
              email.setErrors({ duplicate: true });
            }
          }),
          finalize(() => {
            this.group.get('emailStage').setValue('done');
          })
        ).subscribe();
    }
    phone.valueChanges.pipe(
      debounceTime(250),
      tap(async () => {
        if (phone.valid) {
          this.group.get('phoneStage').setValue('querying');
          const checkPhone = await this.service.checkUnique('phone', phone.value).toPromise();
          if (checkPhone) {
            phone.setErrors({ duplicate: true });
          } else {
            phone.setErrors(null);
          }
          this.group.get('phoneStage').setValue('done');
        }
      })
    ).subscribe();
    email.valueChanges.pipe(
      debounceTime(250),
      tap(async () => {
        if (email.valid) {
          this.group.get('emailStage').setValue('querying');
          const checkPhone = await this.service.checkUnique('email', email.value).toPromise();
          if (checkPhone) {
            email.setErrors({ duplicate: true });
          } else {
            email.setErrors(null);
          }
          this.group.get('emailStage').setValue('done');
        }
      })
    ).subscribe();
  }
  useSelectImage = (event: any, input: HTMLElement) => {
    this.group.get('errorImage').setValue(false);
    const files: File[] = event.target.files;
    if (files.length > 1) {
      this.group.get('errorImage').setValue(true);
      this.group.get('errorImageMessage').setValue('Only one image accepted');
      input.nodeValue = undefined;
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(files[0].type)) {
        if (files[0].size > 1024 * 1024 * 18) {
          this.group.get('errorImage').setValue(true);
          this.group.get('errorImageMessage').setValue('Only image size less than 18MB accept');
          input.nodeValue = undefined;
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.group.get('avatar').setValue(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      } else {
        this.group.get('errorImage').setValue(true);
        this.group.get('errorImageMessage').setValue('Only one image accepted');
        input.nodeValue = undefined;
      }
    }
  }
}
