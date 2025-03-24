import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalHeader, IJournalTemplate } from "app/models/journals";
import { JournalService } from "./journal.service";
import { TypeService } from "./type.service";

import { TypeStore } from "./type.service";

import { combineLatestWith, Observable, of } from "rxjs";
import { IAccounts } from "app/models";
import { IGLType, IType } from "app/models/types";
import { AccountsStore } from "app/store/accounts.store";
import { TemplateStore } from "app/store/template.store";
import { PartyService } from "./party.service";
import { IParty } from "app/models/party";

interface IJournalData {
  journalHeader:IJournalHeader;
  accounts: IAccounts[];
  journalTypes: IGLType[];
  templates: IJournalTemplate[];  
  parties: IParty[];
}

export const JournalResolver: ResolveFn <IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { 
    const accounts = of(inject(AccountsStore).accounts());    
    const templates = of(inject(TemplateStore).template());
    const journalHeader = inject(JournalService).getJournalHeaderById(Number(route.paramMap.get('id')));
    return journalHeader.pipe(combineLatestWith(
      [ 
      accounts,
      inject(TypeService).read(),
      templates, 
      inject(PartyService).read()
     ]
  )) as any as Observable<IJournalData>;    
};
