import { Component, Input, OnInit } from '@angular/core';
import { TicketService } from '@services';
import { TicketVM } from '@view-models';

@Component({
  selector: 'app-reuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit {
  @Input() ticket: TicketVM;
  constructor(
    protected readonly ticketService: TicketService
  ) { }

  ngOnInit() {
    this.ticketService.findById(this.ticket.id).subscribe((data) => this.ticket = data);
  }

}
