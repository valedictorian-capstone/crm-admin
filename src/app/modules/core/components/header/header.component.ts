import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionMenuItem } from '@extras/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() useClickOutside: EventEmitter<any> = new EventEmitter<any>();
  @Output() useToggle: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('search') search: ElementRef;
  @ViewChild('left') left: ElementRef;
  @ViewChild('bell') bell: ElementRef;
  @ViewChild('header') header: ElementRef;
  searchFocus = false;
  leftFocus = false;
  bellFocus = false;
  avatar = '../../../../../assets/avatars/avatar.jpg';
  name = 'Elias';
  actions: ActionMenuItem[] = [
    {
      label: 'Edit Profile',
      value: 'profile',
      icon: {
        icon: 'credit-card-outline',
        status: 'basic'
      },
      textColor: 'text-default',
    },
    {
      label: 'Setting',
      value: 'setting',
      icon: {
        icon: 'settings-outline',
        status: 'basic'
      },
      textColor: 'text-default',
    },
    {
      label: 'Logout',
      value: 'loggout',
      icon: {
        icon: 'log-out-outline',
        status: 'basic'
      },
      textColor: 'text-default',
    },
  ];
  constructor(
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    window.onclick = (event) => {
      if (this.left.nativeElement.contains(event.target)) {
        this.useToggle.emit();
      } else {
        if (event.target && this.header.nativeElement.contains(event.target)) {
          this.useClickOutside.emit();
        }
      }
      if (this.search.nativeElement.contains(event.target)) {
        this.searchFocus = true;
      } else {
        this.searchFocus = false;
      }
      if (this.bell.nativeElement.contains(event.target)) {
        this.bellFocus = true;
      } else {
        this.bellFocus = false;
      }
    };
  }

  useProfile = () => {

  }
  useSetting = () => {

  }
  useLogout = () => {
    localStorage.clear();
    this.router.navigate(['']);
  }

  useAction = (action: ActionMenuItem) => {
    switch (action.value) {
      case 'profile':
        this.useProfile();
        return;
      case 'setting':
        this.useSetting();
        return;
      case 'loggout':
        this.useLogout();
        return;
    }
  }
}
