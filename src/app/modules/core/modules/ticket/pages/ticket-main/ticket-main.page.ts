import { Component, OnInit } from '@angular/core';
import { TicketService, GlobalService } from '@services';
import { TicketVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-main',
  templateUrl: './ticket-main.page.html',
  styleUrls: ['./ticket-main.page.scss']
})
export class TicketMainPage implements OnInit {
  tickets: TicketVM[] = [];
  filterTickets: TicketVM[] = [];
  search = '';
  stage = 'done';
  constructor(
    protected readonly ticketService: TicketService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.useReload();
    this.useSocket();
  }
  useReload = () => {
    this.useShowSpinner();
    this.ticketService.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.tickets = data;
        this.useFilter();
      });
  }
  useFilter = () => {
    this.filterTickets = this.tickets.filter((e) =>
      e.customer.fullname.toLowerCase().includes(this.search.toLowerCase())
    );
  }
  useSocket = () => {
    this.ticketService.triggerSocket().subscribe((trigger) => {
        if (trigger.type === 'create') {
          this.tickets.push((trigger.data as TicketVM));
        } else if (trigger.type === 'update') {
          this.tickets[this.tickets.findIndex((e) => e.id === (trigger.data as TicketVM).id)] = (trigger.data as TicketVM);
        } else if (trigger.type === 'remove') {
          this.tickets.splice(this.tickets.findIndex((e) => e.id === (trigger.data as TicketVM).id), 1);
        }
        this.useFilter();
    });
  }
  usePlus = () => {
    this.globalService.triggerView$.next({ type: 'ticket', payload: {} });
  }
  useImport = () => {
    this.globalService.triggerView$.next({ type: 'import', payload: { importType: 'ticket' } });
  }
  useShowSpinner = () => {
    this.spinner.show('ticket-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('ticket-main');
    }, 1000);
  }
}
