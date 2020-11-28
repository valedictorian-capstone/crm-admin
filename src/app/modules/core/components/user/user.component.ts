import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GlobalService } from '@services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  fullname = JSON.parse(localStorage.getItem('fullname'));
  avatar = localStorage.getItem('avatar') ? JSON.parse(localStorage.getItem('avatar')) : undefined;
  canSetting = true;
  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
  ) {
    activatedRoute.data.subscribe((data) => console.log(data));
  }

  ngOnInit(
  ) {
  }
  useOut = () => {
    localStorage.clear();
    this.router.navigate(['auth']);
  }
  useProfile = () => {
    this.globalService.triggerView$.next({ type: 'setting-profile', payload: {} });
  }
  usePassword = () => {
    this.globalService.triggerView$.next({ type: 'setting-password', payload: {} });
  }
  useSetting = () => {
    this.globalService.triggerView$.next({ type: 'setting-permission', payload: {} });
  }
}
