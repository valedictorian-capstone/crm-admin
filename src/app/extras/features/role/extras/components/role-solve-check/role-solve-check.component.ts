import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-role-solve-check',
  templateUrl: './role-solve-check.component.html',
  styleUrls: ['./role-solve-check.component.scss']
})
export class RoleSolveCheckComponent {
  @Input() checkList: {formControl: FormControl, role: RoleVM}[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    protected readonly service: RoleService,
    protected readonly toastrService: NbToastrService,
  ) {
  }
  async useRemove() {
    const rs = await swal.fire({
      title: 'Remove all selected roles?',
      text: 'When you click OK button, all selected roles will be remove out of system and can not backup',
      showCancelButton: true,
    });
    // if (rs.isConfirmed) {
    //   const subscription = this.service.removeMany(this.checkList.map((e) => e.role))
    //     .pipe(
    //       tap((data) => {
    //         this.toastrService.success('', 'Remove  all selected roles successful', { duration: 3000 });
    //       }),
    //       catchError((err) => {
    //         this.toastrService.danger('', 'Remove  all selected roles fail! ' + err.message, { duration: 3000 });
    //         return of(undefined);
    //       })
    //     ).subscribe(console.log);
    //   this.subscriptions.push(subscription);
    // }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription$) => subscription$.unsubscribe());
  }
}
