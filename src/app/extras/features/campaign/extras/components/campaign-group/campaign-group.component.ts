import { Component, OnInit, Input } from '@angular/core';
import { CampaignService, GroupService } from '@services';
import { CampaignVM, CampaignGroupVM, GroupVM, ParameterVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { catchError, finalize, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@store/states';
import { GroupAction } from '@store/actions';
import { DropResult } from 'ngx-smooth-dnd';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-campaign-group',
  templateUrl: './campaign-group.component.html',
  styleUrls: ['./campaign-group.component.scss']
})
export class CampaignGroupComponent {
  @Input() campaign: CampaignVM;
  @Input() canUpdate: boolean;
  @Input() cGroups: CampaignGroupVM[] = [];
  campaignGroups: FormArray = new FormArray([]);
  groups: GroupVM[] = [];
  show = true;
  showChange = false;
  constructor(
    protected readonly service: CampaignService,
    protected readonly groupService: GroupService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly store: Store<State>
  ) {
    this.useLoadGroup();
  }
  ngOnInit() {
  }
  ngOnChanges() {
    this.useReset();
  }
  useLoadGroup() {
    this.store.select((state) => state.group)
    .pipe(
      tap((group) => {
        const firstLoad = group.firstLoad;
        const data = (group.ids as string[]).map((id) => group.entities[id]);
        if (!firstLoad) {
          this.store.dispatch(GroupAction.FindAllAction({}));
        } else {
          this.groups = data;
        }
      }),
      catchError((err) => {
        return of(undefined);
      }),
    ).subscribe();
  }
  useChange() {
    console.log(this.campaignGroups);
    if (this.campaignGroups.valid) {
      this.useShowSpinner();
      this.service.update({
        id: this.campaign.id,
        campaignGroups: this.campaignGroups.controls.map((e) => ({
          campaign: { id: this.campaign.id },
          group: { id: e.value.group },
          parameters: JSON.stringify(e.value.parameters),
        }))
      } as any)
        .pipe(
          tap((data) => {
            swal.fire('Change campaign group successful!', '', 'success');
          }),
          catchError((err) => {
            swal.fire('Change campaign group fail!', 'Error: ' + err.message, 'error');
            return of(undefined);
          }),
          finalize(() => {
            this.showChange = false;
            this.useHideSpinner();
          })
        ).subscribe();
    } else {
      swal.fire('Please add more product!', '', 'warning')
    }
  }
  useRemoveGroup = (index: number) => {
    this.campaignGroups.removeAt(index);
  }
  usePlusGroup = (campaignGroup?: CampaignGroupVM) => {
    const group = new FormGroup({
      group: new FormControl(campaignGroup ? campaignGroup.group.id : undefined),
      parameters: new FormControl(campaignGroup ? campaignGroup.parameters : []),
    });
    if (campaignGroup) {
      group.addControl('id', new FormControl(campaignGroup.id));
    }
    this.campaignGroups.push(group);
  }
  useRemoveParameter = (index: number, fGroup: FormGroup) => {
    (fGroup.value.parameters as ParameterVM[]).splice(index, 1);
  }
  usePlusParameter = (fGroup: FormGroup) => {
    (fGroup.value.parameters as ParameterVM[]).push({ value: '', label: '' });
  }
  useReset() {
    this.campaignGroups.clear();
    this.cGroups.forEach((campaignGroup) => this.usePlusGroup(campaignGroup));
  }
  useDrop = (event: DropResult, fGroup: FormGroup) => {
    if (event.removedIndex != null && event.addedIndex != null) {
      moveItemInArray((fGroup.value.parameters as ParameterVM[]), event.removedIndex, event.addedIndex);
    }
  }
  useShowSpinner = () => {
    this.spinner.show('campaign-group');
  }
  useHideSpinner = () => {
    this.spinner.hide('campaign-group');
  }
  useCheckGroup(group: GroupVM) {
    return this.campaignGroups.controls.filter((e) => e.value.group === group.id).length > 0;
  }
  useRenderGroup(id: string) {
    const group = this.groups.find((g) => g.id === id);
    const cGroup = this.cGroups.find((g) => g.group.id === id);
    if (group) {
      return group.name;
    } else {
      return cGroup ? cGroup.group.name : '';
    }
  }
}
