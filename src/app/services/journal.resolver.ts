import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalHeader, IJournalTemplate } from "app/models/journals";
import { JournalService } from "./journal.service";
import { combineLatestWith, Observable, of } from "rxjs";
import { IDropDownAccounts } from "app/models";
import { IGLType } from "app/models/types";
import { SubTypeService } from "./subtype.service";
import { PartyService } from "./party.service";
import { IParty } from "app/models/party";
import { AccountsService } from "./accounts.service";
import { TemplateService } from "./template.service";

interface IJournalData {
  journalHeader:IJournalHeader;
  accounts: IDropDownAccounts[];
  journalTypes: IGLType[];
  templates: IJournalTemplate[];  
  parties: IParty[];
}

export const JournalResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    const journalHeader = inject(JournalService).getJournalHeaderById(Number(route.paramMap.get('id')));
    return journalHeader.pipe(combineLatestWith(
      [ 
      inject(AccountsService).readChildren(),
      inject(SubTypeService).read(),
      inject(TemplateService).read(),      
      inject(PartyService).read()
     ]
  )) as any as Observable<IJournalData>;    
};
