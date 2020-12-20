import { ComponentFactoryResolver, ComponentRef, Directive, Input, ViewContainerRef, OnInit } from '@angular/core';
import { ActivityVM, AttachmentVM, NoteVM } from '@view-models';
import { DealActivityComponent, DealAttachmentComponent, DealNoteComponent, DealLogComponent } from '../components';

@Directive({
  selector: '[appDealDynamic]'
})
export class DealDynamicDirective implements OnInit {
  @Input() type: string;
  @Input() data: ActivityVM & {state: string} | NoteVM | AttachmentVM;
  componentRef: ComponentRef<DealActivityComponent | DealNoteComponent | DealAttachmentComponent>;
  componentMapper = {
    log: DealLogComponent,
    activity: DealActivityComponent,
    note: DealNoteComponent,
    attachment: DealAttachmentComponent,
  };
  constructor(
    protected readonly resolver: ComponentFactoryResolver,
    protected readonly container: ViewContainerRef,
  ) {

  }
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory<DealActivityComponent | DealNoteComponent | DealAttachmentComponent>(
      this.componentMapper[this.type]
    );
    this.componentRef = this.container.createComponent<DealActivityComponent | DealNoteComponent | DealAttachmentComponent>(factory);
    this.componentRef.instance.data = this.data;
  }
}
