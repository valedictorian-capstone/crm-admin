import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-role',
  templateUrl: './employee-role.component.html',
  styleUrls: ['./employee-role.component.scss']
})
export class EmployeeRoleComponent {
  constructor(
    protected readonly router: Router
  ) { }

  useRoute() {
    this.router.navigate(['core/role']);
  }
}
