import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionMenuItem } from '@extras/models';
import { CommentService, ProcessInstanceService } from '@services';
import { ProcessInstanceVM, ProcessStepInstanceVM, TaskVM } from '@view-models';
import { of } from 'rxjs';
import { pluck, switchMap, tap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Clipboard } from '@angular/cdk/clipboard';
import { NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.scss'],
  providers: [DecimalPipe]
})
export class InstanceDetailComponent implements OnInit {
  instance: ProcessInstanceVM;
  actions: ActionMenuItem[] = [
    {
      label: 'Edit role\'s information',
      value: 'edit',
      icon: {
        icon: 'edit-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
    {
      label: 'Disabled role',
      value: 'remove',
      icon: {
        icon: 'trash-2-outline',
        status: 'danger'
      },
      textColor: 'text-danger',
    }
  ];
  headerActions: ActionMenuItem[] = [
    {
      label: 'Export to excel',
      value: 'export',
      icon: {
        icon: 'cloud-download-outline',
        status: 'info'
      },
      textColor: 'text-info',
    },
  ];
  icons = [
    {
      name: 'activity-task',
      value: 'bpmn-icon-call-activity'
    },
    {
      name: 'gateway-parallel',
      value: 'bpmn-icon-gateway-parallel'
    },
    {
      name: 'gateway-exclusive',
      value: 'bpmn-icon-gateway-xor'
    },
    {
      name: 'gateway-inclusive',
      value: 'bpmn-icon-gateway-or'
    },
    {
      name: 'event-start',
      value: 'bpmn-icon-start-event-none'
    },
    {
      name: 'event-end',
      value: 'bpmn-icon-end-event-none'
    },
  ];
  env = 'desktop';
  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly router: Router,
    protected readonly processInstanceService: ProcessInstanceService,
    protected readonly commentService: CommentService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly clipboard: Clipboard,
    protected readonly toastrService: NbToastrService,
    protected readonly dialogService: NbDialogService,
    protected readonly decimalPipe: DecimalPipe,
  ) {
    if (deviceService.isMobile()) {
      this.env = 'mobile';
    }
    this.activatedRoute.params.pipe(
      pluck('id'),
      tap((id) => {
        if (!id) {
          this.router.navigate(['core/process']);
        }
      }),
      switchMap((id) => id ? this.processInstanceService.findById(id) : of(undefined))
    ).subscribe((data) => {
      this.instance = data;
    });
  }
  ngOnInit() {
  }
  useIcon = (data: string) => {
    return this.icons.find((icon) => icon.name === data);
  }
  useCollapsedChange = (ref: HTMLElement, event: any) => {
    setTimeout(() => {
      if (event) {
        ref.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }, 200);
  }
  useProgress = (step: ProcessStepInstanceVM) => {
    const done = step.tasks.filter((task) => task.status === 'done').length;
    return step.tasks.length > 0 ? done * 100 / step.tasks.length : 100;
  }
  useStatus = (step: ProcessStepInstanceVM) => {
    const percent = this.useProgress(step);
    return percent <= 25 ? 'info' : (percent <= 50 ? 'warning' : (percent <= 75 ? 'primary' : 'success'));
  }
  useLeader = (step: ProcessStepInstanceVM) => {
    return step.processStep.department.accountDepartments.find((e) => e.isLeader);
  }
  useMembers = (step: ProcessStepInstanceVM) => {
    return step.processStep.department.accountDepartments.filter((e) => !e.isLeader);
  }
  useEmoji = (event, inp) => {
    inp.value = inp.value + event.emoji.native;
  }
  useComment = (step: ProcessStepInstanceVM, inp: any, comments: any, emo: any) => {
    this.commentService.insert({
      message: inp.value,
      account: { id: 'f4e57bf5-0bd6-4c8a-a10f-d398d4784f89' },
      processStepInstance: { id: step.id }
    } as any)
      .subscribe((data) => {
        step.comments.push(data);
        inp.value = '';
        emo.style.display = 'none';
        this.useLoadBottom(comments);
      });
  }
  useLoadBottom = (comments: any) => {
    if (comments) {
      setTimeout(() => {
        comments.scrollTop = comments.scrollHeight;
      }, 100);
    }
  }
  useCopy = (data: string) => {
    this.clipboard.copy(data);
    this.toastrService.show('', 'Copy success', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success' });
  }
  useCreate = (dialog: NbDialogRef<any>, data: TaskVM, step: ProcessStepInstanceVM) => {
    step.tasks.push(data);
    dialog.close();
  }
  useUpdate = (dialog: NbDialogRef<any>, data: TaskVM, step: ProcessStepInstanceVM, index: number) => {
    step.tasks[index] = data;
    dialog.close();
  }
  // useRemove = (data: RoleVM, index: number) => {
  //   swal.fire({
  //     showCancelButton: true,
  //     cancelButtonText: 'Not Sure',
  //     confirmButtonText: 'Sure',
  //     title: 'Confirm',
  //     icon: 'question',
  //     text: 'Are you sure to disabled ' + data.name + ' ?',
  //   }).then((res) => {
  //     if (res.isConfirmed) {
  //       this.service.remove(data.id).subscribe(
  //         () => {
  //           this.roles.splice(index, 1);
  //           this.useFilter();
  //           swal.fire('Notification', 'Delete ' + data.name + ' successfully!!', 'success');
  //         },
  //         (error) => {
  //           swal.fire('Notification', 'Something wrong on runtime! Please check again', 'error');
  //         }
  //       );
  //     }
  //   });
  // }
  useDialog(template: TemplateRef<any>, dialogClass: string) {
    this.dialogService.open(template, { dialogClass });
  }
  useStatisticsStatusCompletion = (step: ProcessStepInstanceVM) => {
    return {
      title: {
        x: 'center',
      },
      color: ['#20c997', '#17a2b8', '#dc3545'],
      tooltip: {
        trigger: 'item',
        position: [10, 10],
        formatter: (params) => {
          params.value = this.decimalPipe.transform(params.value, '1.0-0').split(',').join('.');
          return (
            params.seriesName + ' - ' + params.name + ' : ' + params.value + ' tasks (' + params.percent + '%)'
          );
        },
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['done', 'processing', 'cancel'],
      },
      calculable: true,
      series: [
        {
          name: 'Ratio',
          selectedMode: 'single',
          type: 'pie',
          radius: 100,
          data: [
            {
              name: 'done',
              value: step.tasks.filter((task) => task.status === 'done').length,
            },
            {
              name: 'processing',
              value: step.tasks.filter((task) => task.status === 'processing').length,
            },
            {
              name: 'cancel',
              value: step.tasks.filter((task) => task.status === 'cancel').length,
            },
          ],
        },
      ],
    };
  }
}
