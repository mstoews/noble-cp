import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalTemplate } from "app/models/journals";

import { TypeService } from "./type.service";
import { combineLatestWith, Observable, of } from "rxjs";
import { IAccounts, IFunds } from "app/models";
import { IGLType, IType } from "app/models/types";
import { AccountsStore } from "app/store/accounts.store";
import { PartyService } from "./party.service";
import { IParty } from "app/models/party";
import { TemplateService } from "./template.service";
import { FundsService } from "app/services/funds.service";
import { IPeriod } from "app/models/period";
import { IRole } from "./roles.service";
import { IUser } from "app/models/user";
import { PeriodsService } from "./periods.service";
import { UserService } from "./user.service";
import { AccountsService } from "./accounts.service";

interface IJournalData {
  accounts: IAccounts[];
  funds: IFunds[];
  // journalTypes: IGLType[];
  templates: IJournalTemplate[];
  parties: IParty[];
  subTypes: IType[];
  periods: IPeriod[];
}

export const StaticResolver: ResolveFn<IJournalData> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  return inject(AccountsService).readAccounts().pipe(combineLatestWith([
    // inject(FundsService).read(),
    // // inject(TypeService).read(),
    // inject(TemplateService).read(),
    // inject(PartyService).read(),
    // inject(PeriodsService).read()
  ]
  )) as any as Observable<IJournalData>;
};


