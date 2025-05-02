import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JournalService } from "app/services/journal.service";
import { combineLatestWith, Observable, take } from "rxjs";
import { PartyService } from "app/services/party.service";
import { AccountsService } from "app/services/accounts.service";

export const JournalListResolver: ResolveFn<any> = (  
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const accountService = inject(AccountsService);
  const partyService = inject(PartyService);
  const journalService = inject(JournalService);
  return journalService.getCurrentPeriod().pipe(take(1)).subscribe(  
    (Period) => {
        accountService.readChildren().pipe(combineLatestWith([
        partyService.read()
      ]
      ))
    }) as any;
};
