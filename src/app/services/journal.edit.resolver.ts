import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalHeader, IJournalTemplate } from "app/models/journals";
import { JournalService } from "./journal.service";

import { combineLatestWith, Observable, of, take } from "rxjs";
import { IDropDownAccounts } from "app/models";
import { IGLType } from "app/models/types";
import { PartyService } from "./party.service";
import { AccountsService } from "./accounts.service";
import { IParty } from "app/models/party";
import { TemplateService } from "./template.service";
import { SubTypeService } from "./subtype.service";

interface IJournalData {
  journalHeader:IJournalHeader;
  accounts: IDropDownAccounts[];
  journalTypes: IGLType[];
  templates: IJournalTemplate[];  
  parties: IParty[];
}

export const JournalEditResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    return inject(JournalService).getLastJournalNo().pipe(take(1)).subscribe(
      (journalNo) => {        
          inject(JournalService).getJournalHeaderById(journalNo).pipe(combineLatestWith([
          inject(AccountsService).readChildren(),
          inject(SubTypeService).read(),
          inject(TemplateService).read(),          
          inject(PartyService).read()
         ]
        )) 
      }) as any as Observable<IJournalData>;    
  }; 
