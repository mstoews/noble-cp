import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JournalService } from "./journal.service";
import { combineLatestWith, Observable } from "rxjs";
import { SubTypeService } from "./subtype.service";
import { PartyService } from "./party.service";
import { AccountsService } from "./accounts.service";
import { TemplateService } from "./template.service";
import { PeriodsService } from "./periods.service";

import { IJournalData } from "app/models/journals";

export const JournalResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 

    const accountsService =  inject(AccountsService)
    const subTypeService = inject(SubTypeService)
    const templateService = inject(TemplateService)
    const partyService = inject(PartyService)
    const journalService = inject(JournalService)
    const periodService = inject(PeriodsService)
    const journalHeader = journalService.getJournalHeaderById(Number(route.paramMap.get('id')));
    return journalHeader.pipe(combineLatestWith(
      [ 
      accountsService.readChildren(),
      subTypeService.read(),
      templateService.read(),      
      partyService.read(),
      journalService.getHttpJournalDetails(Number(route.paramMap.get('id'))),
      // periodService.getActivePeriods(),
     ]
  )) as any as Observable<IJournalData>;    
};
