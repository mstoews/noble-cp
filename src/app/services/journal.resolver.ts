import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IJournalHeader } from "app/models/journals";
import { JournalService } from "./journal.service";

export const JournalResolver: ResolveFn<IJournalHeader> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot ) => { return inject(JournalService).getJournalHeaderById(Number(route.paramMap.get('id'))); };
