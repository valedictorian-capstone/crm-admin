import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  constructor(
    protected readonly router: Router,
    protected readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      phoneOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {

  }
  getStatus = (name: 'phoneOrEmail' | 'password'): 'danger' | 'success' | 'default' => {
    const control = this.form.get(name);
    return (control.touched || control.dirty) ? (control.invalid ? 'danger' : 'success') : 'default';
  }
  useSubmit = async () => {
    if (this.form.valid) {
      this.router.navigate(['core']);
    } else {
      this.form.get('phoneOrEmail').markAsTouched();
      this.form.get('password').markAsTouched();
    }
  }
  useEnter = (event) => {
    if (event.key === 'Enter') {
        this.useSubmit();
    }
  }
}
