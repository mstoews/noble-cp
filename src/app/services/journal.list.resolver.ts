import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { JournalService } from "./journal.service";
import { combineLatestWith, Observable, take } from "rxjs";
import { SubTypeService } from "./subtype.service";
import { PartyService } from "./party.service";
import { AccountsService } from "./accounts.service";
import { TemplateService } from "./template.service";
import { PeriodsService } from "./periods.service";
import { IJournalData } from "app/models/journals";

export const JournalListResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    const currentPeriod = inject(JournalService).getCurrentPeriod().pipe(take(1));
    return currentPeriod.pipe(combineLatestWith(
      [ 
      inject(AccountsService).readChildren(),
      inject(SubTypeService).read(),
      inject(TemplateService).read(),      
      inject(PartyService).read(),
      inject(PeriodsService).getActivePeriods()      
     ]
  )) as any;    
};
