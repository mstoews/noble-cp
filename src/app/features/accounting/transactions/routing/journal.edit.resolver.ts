import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalHeader, IJournalTemplate } from "app/models/journals";
import { JournalService } from "../../../../services/journal.service";

import { combineLatestWith, Observable, of, take } from "rxjs";
import { IDropDownAccounts } from "app/models";
import { IGLType } from "app/models/types";
import { PartyService } from "../../../../services/party.service";
import { AccountsService } from "../../../../services/accounts.service";
import { IParty } from "app/models/party";
import { TemplateService } from "../../../../services/template.service";
import { SubTypeService } from "../../../../services/subtype.service";

interface IJournalData {
  journalNo: string;
  journalHeader: IJournalHeader;
  accounts: IDropDownAccounts[];
  journalTypes: IGLType[];
  templates: IJournalTemplate[];
  parties: IParty[];
}

export const JournalEditResolver: ResolveFn<IJournalData> = (
  
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const journalStore = inject(JournalService);
  return journalStore.getLastJournalNo().pipe(take(1)).subscribe(
    (journalNo) => {
        journalStore.getJournalHeaderById(journalNo).pipe(combineLatestWith([
        inject(AccountsService).readChildren(),
        inject(SubTypeService).read(),
        inject(TemplateService).read(),
        inject(PartyService).read()
      ]
      ))
    }) as any as Observable<IJournalData>;
}; 
