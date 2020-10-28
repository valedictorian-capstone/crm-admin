import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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
  @ViewChild('right') right: ElementRef;
  @ViewChild('bell') bell: ElementRef;
  @ViewChild('header') header: ElementRef;
  @ViewChild('profile') profile: ElementRef;
  @ViewChild('setting') setting: ElementRef;
  @ViewChild('logout') logout: ElementRef;
  searchFocus = false;
  rightFocus = false;
  leftFocus = false;
  bellFocus = false;
  avatar = '../../../../../assets/avatars/avatar.jpg';
  name = 'Elias';
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
      if (this.right.nativeElement.contains(event.target)) {
        if (
          this.profile.nativeElement.contains(event.target)
          || this.logout.nativeElement.contains(event.target)
          || this.setting.nativeElement.contains(event.target
          )) {
            this.rightFocus = false;
        } else {
          this.rightFocus = true;
        }
      } else {
        this.rightFocus = false;
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
}
