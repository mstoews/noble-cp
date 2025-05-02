import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { combineLatestWith, Observable, of, take } from "rxjs";

import { PartyService } from "app/services/party.service";
import { AccountsService } from "app/services/accounts.service";
import { TemplateService } from "app/services/template.service";
import { SubTypeService } from "app/services/subtype.service";
import { JournalService } from "app/services/journal.service";

import { IParty } from "app/models/party";
import { IGLType } from "app/models/types";
import { IJournalHeader, IJournalTemplate } from "app/models/journals";
import { IDropDownAccounts } from "app/models";

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
  const journalService = inject(JournalService);
  const partyService = inject(PartyService);
  const accountsService = inject(AccountsService);
  const subtypeService = inject(SubTypeService);
  const templateService = inject(TemplateService);
  return journalService.getLastJournalNo().pipe(take(1)).subscribe(
    (journalNo) => {
        journalService.getJournalHeaderById(journalNo).pipe(combineLatestWith(
        [
        accountsService.readChildren(),
        subtypeService.read(),
        templateService.read(),
        partyService.read()
       ]
      ))
    }) as any;
}; 
