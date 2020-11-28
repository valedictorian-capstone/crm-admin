import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from '@services';
import { RoleVM } from '@view-models';

@Component({
  selector: 'app-reuse-role-select',
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.scss']
})
export class RoleSelectComponent implements OnInit {
  @Output() useSelect: EventEmitter<RoleVM> = new EventEmitter<RoleVM>();
  @Input() template: HTMLElement;
  @Input() selected: RoleVM;
  roles: RoleVM[] = [];
  value = '';
  stage = 'done';
  constructor(
    protected readonly roleService: RoleService,
  ) { }

  ngOnInit() {
    this.roleService.findAll().subscribe((data) => {
      this.roles = data;
      setTimeout(() => {
        this.stage = 'done';
      }, 500);
    });
  }
}
