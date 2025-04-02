import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { TemplateService } from '../services/template.service';
import { IJournalDetailTemplate, IJournalTemplate } from "../models/journals";
import { IDropDownAccounts, IFunds } from 'app/models';
import { IParty } from 'app/models/party';
import { ISubType } from 'app/models/subtypes';
import { IType } from 'app/models/types';
import { AccountsStore } from './accounts.store';
import { FundsStore } from './funds.store';
import { MainPanelStore } from './main.panel.store';
import { PartyStore } from './party.store';
import { PeriodStore } from './periods.store';
import { loadParty } from 'app/features/accounting/transactions/state/journal/Journal.Action';
import { PartyService } from 'app/services/party.service';

export interface TemplateStateInterface {
  tmp: IJournalTemplate[];
  tmp_details: IJournalDetailTemplate[];
  accounts: IDropDownAccounts[];
  account_type: IType[],
  party: IParty[],
  sub_type: ISubType[],
  funds: IFunds[],
  isLoading: boolean;
  error: string | null;
}

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState<TemplateStateInterface>({
    tmp: [],
    tmp_details: [],
    accounts: [],
    account_type:[],
    party: [],
    sub_type: [],
    funds: [],    
    error: null,
    isLoading: false,
  }),

  withMethods((state, 
    partyService = inject(PartyService),
    accountsStore = inject(AccountsStore),
    fundsStore = inject(FundsStore),    
    templateService = inject(TemplateService)) => ({            
    readParty: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return partyService.read().pipe(
              tapResponse({
                next: (party) => patchState(state, { party: party }),
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
    ),
    readAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return partyService.read().pipe(
            tapResponse({
              next: (party) => patchState(state, { party: party }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
  ),
  readFunds: rxMethod<void>(
    pipe(
      tap(() => patchState(state, { isLoading: true })),
      exhaustMap(() => {
        return partyService.read().pipe(
          tapResponse({
            next: (party) => patchState(state, { party: party }),
            error: console.error,
            finalize: () => patchState(state, { isLoading: false }),
          })
        );
      })
    )
  ),
  readAccountType: rxMethod<void>(
  pipe(
    tap(() => patchState(state, { isLoading: true })),
    exhaustMap(() => {
      return partyService.read().pipe(
        tapResponse({
          next: (party) => patchState(state, { party: party }),
          error: console.error,
          finalize: () => patchState(state, { isLoading: false }),
          })
        );
      })
    )
  ),
    addTemplate: rxMethod<IJournalTemplate>(pipe(
      switchMap((value) => {
        patchState(state, { isLoading: true });
        return templateService.create(value).pipe(
          tapResponse({
            next: (template) => {
              patchState(state, { tmp: [...state.tmp(), template] });
            },
            error: console.error,
            finalize: () => patchState(state, { isLoading: false }),
          })
        );
      })
    )
    ),
    updateTemplate: rxMethod<IJournalTemplate>(
      pipe(
        switchMap((value) => {
          return templateService.update(value).pipe(
            tapResponse({
              next: (template) => {
                const updatedTemplate = state.tmp().filter((template) => template.template_name !== template.template_name);
                patchState(state, { tmp: updatedTemplate });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readTemplate: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return templateService.read().pipe(
            tapResponse({
              next: (template) => patchState(state, { tmp: template }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readTemplateDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap((value) => {
          return templateService.readTemplateDetails(value).pipe(
            tapResponse({
              next: (template) => patchState(state, { tmp_details: template }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.readTemplate();
    },
  })
);
