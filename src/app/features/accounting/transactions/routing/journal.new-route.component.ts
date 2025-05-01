import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';


@Component({
  selector: 'journal-new-route',
  providers: [],
  imports: [MatProgressSpinner],
  template: `
      <div id="settings" class="w-full control-section default-splitter flex flex-col overflow-hidden">    
          <div class="flex justify-center items-center mt-[100px]">
                <mat-spinner></mat-spinner>
          </div>
      </div>
  `,
})
export class JournalNewRouteComponent {
  router = inject(Router);
  constructor() {          
    this.router.navigate(["journals/new"]);
  }

}
