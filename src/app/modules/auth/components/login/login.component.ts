import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import * as firebase from 'firebase';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  formConfirm: FormGroup;
  isConfirm = false;
  windowRef: { recaptchaVerifier: firebase.auth.RecaptchaVerifier, confirmationResult: firebase.auth.ConfirmationResult };
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      phone: ['', Validators.required],
    });
    this.formConfirm = this.fb.group({
      code: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.windowRef = (window as any);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible'
    });
    this.windowRef.recaptchaVerifier.render();
  }
  getStatus = (name: 'phone' | 'code'): 'danger' | 'success' | 'default' => {
    const control = name === 'phone' ? this.form.get(name) : this.formConfirm.get(name);
    return (control.touched || control.dirty) ? (control.invalid ? 'danger' : 'success') : 'default';
  }
  useSubmit = async () => {
    if (this.form.valid) {
      this.router.navigate(['core']);
      // await firebase.auth().signInWithPhoneNumber('+84' + this.form.value.phone, this.windowRef.recaptchaVerifier)
      //   .then((result) => {
      //     this.windowRef.confirmationResult = result;
      //     console.log(result);
      //     this.isConfirm = true;
      //   })
      //   .catch((err) => console.log(err));
    } else {
      this.form.get('phone').markAsTouched();
    }
  }
  useVerify = async () => {
    if (this.formConfirm.valid) {
      // this.router.navigate(['core']);
      this.windowRef.confirmationResult.confirm(this.formConfirm.value.code)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    } else {
      this.formConfirm.get('code').markAsTouched();
    }
  }
  useEnter = (event) => {
    if (event.key === 'Enter') {
      if (this.isConfirm) {
        this.useVerify();
      } else {
        this.useSubmit();
      }
    }
  }
}
