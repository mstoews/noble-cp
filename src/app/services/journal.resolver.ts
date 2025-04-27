import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JournalService } from "./journal.service";
import { combineLatestWith, Observable } from "rxjs";
import { SubTypeService } from "./subtype.service";
import { PartyService } from "./party.service";
import { AccountsService } from "./accounts.service";
import { TemplateService } from "./template.service";

import { IJournalData } from "app/models/journals";

export const JournalResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    const journalHeader = inject(JournalService).getJournalHeaderById(Number(route.paramMap.get('id')));
    return journalHeader.pipe(combineLatestWith(
      [ 
      inject(AccountsService).readChildren(),
      inject(SubTypeService).read(),
      inject(TemplateService).read(),      
      inject(PartyService).read(),
      inject(JournalService).getHttpJournalDetails(Number(route.paramMap.get('id')))
     ]
  )) as any as Observable<IJournalData>;    
};
