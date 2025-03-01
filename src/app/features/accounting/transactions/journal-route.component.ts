import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JournalService } from 'app/services/journal.service';

@Component({
  selector: 'journal-route',
  imports: [],
  template: ``,
  styles: ``
})
export class JournalRouteComponent {
  router = inject(Router);
  journalServer = inject(JournalService);
  constructor() {
    
    var journal_id = 1;
    this.router.navigate(["journals/gl", journal_id]);

    this.journalServer.getLastJournalNo().subscribe((journal_no) => {
      console.log(journal_no);
      journal_id = journal_no-1;
      this.router.navigate(["journals/gl", journal_id]);
    });
    
  }

}
