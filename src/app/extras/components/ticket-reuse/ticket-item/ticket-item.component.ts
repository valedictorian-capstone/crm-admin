import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from '@services';
import { TicketVM } from '@view-models';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-reuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit {
  @Input() ticket: TicketVM;
  constructor(
    protected readonly ticketService: TicketService,
    protected readonly toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.ticketService.findById(this.ticket.id).subscribe((data) => this.ticket = data);
  }
  useResolve = () => {
    this.ticketService.update({ ...this.ticket, status: 'resolve' } as any).subscribe((data) => {
      this.toastrService.success('', 'Update ticket successful!', { duration: 3000 });
    }, (err) => {
      this.toastrService.success('', 'Update ticket fail!', { duration: 3000 });
    });
  }
  useRemove = () => {
    this.ticketService.remove(this.ticket.id).subscribe((data) => {
      this.toastrService.success('', 'Remove ticket successful!', { duration: 3000 });
    }, (err) => {
      this.toastrService.success('', 'Remove ticket fail!', { duration: 3000 });
    });
  }
}
