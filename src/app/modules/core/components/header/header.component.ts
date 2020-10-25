import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

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
  searchFocus = false;
  rightFocus = false;
  leftFocus = false;
  bellFocus = false;
  avatar = '../../../../../assets/avatars/avatar.jpg';
  name = 'Elias';
  constructor() { }

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
        this.rightFocus = true;
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

}
