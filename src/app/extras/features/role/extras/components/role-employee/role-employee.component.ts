import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-employee',
  templateUrl: './role-employee.component.html',
  styleUrls: ['./role-employee.component.scss']
})
export class RoleEmployeeComponent {
  constructor(
    protected readonly router: Router
  ) { }

  useRoute() {
    this.router.navigate(['core/employee']);
  }
}
