import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { TemplateService } from '../services/template.service';
import { IJournalDetailTemplate, IJournalTemplate } from "../models/journals";
import { IDropDownAccounts, IFunds } from 'app/models';
import { IParty } from 'app/models/party';
import { ISubType } from 'app/models/subtypes';
import { IGLType, IType } from 'app/models/types';
import { PartyService } from 'app/services/party.service';
import { FundsService } from 'app/features/accounting/static/funds/funds.service';
import { SubTypeService } from 'app/services/subtype.service';
import { TypeService } from 'app/services/type.service';
import { AccountsService } from 'app/services/accounts.service';

export interface TemplateStateInterface {
  tmp: IJournalTemplate[];
  tmp_details: IJournalDetailTemplate[];
  accounts: IDropDownAccounts[];
  account_type: IGLType[],
  party: IParty[],
  sub_type: ISubType[],
  funds: IFunds[],
  type: IType[],
  isLoading: boolean;
  error: string | null;
}

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState<TemplateStateInterface>({
    tmp: [],
    tmp_details: [],
    party: [],
    accounts: [],
    funds: [],
    sub_type: [],
    account_type: [],    
    type: [],
    error: null,
    isLoading: false,
  }),

  withMethods((state,
    partyService = inject(PartyService),
    accountService = inject(AccountsService),
    fundsService = inject(FundsService),
    subTypeService = inject(SubTypeService),
    typeService = inject(TypeService),
    templateService = inject(TemplateService)) => ({
    // template
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
    // template details
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
      // party
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
      // accounts
      readDropDownAccounts: rxMethod<void>(pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return accountService.readAccountDropdown().pipe(
            tapResponse({
              next: (account) => patchState(state, { accounts : account }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
       )
      ),
      // funds
      readFunds: rxMethod<void>(pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return fundsService.read().pipe(
            tapResponse({
              next: (funds) => patchState(state, { funds: funds }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
      ),
      // sub type
      readSubType: rxMethod<void>(pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return subTypeService.read().pipe(
            tapResponse({
              next: (subType) => patchState(state, { sub_type: subType }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
      ),
      // type
      readAccountType: rxMethod<void>(pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return typeService.read().pipe(
            tapResponse({
              next: (type) => patchState(state, { account_type: type }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
      ),
      // add template
      addTemplate: rxMethod<IJournalTemplate>(pipe(
        tap(() => patchState(state, { isLoading: true })),
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
      // update template
      updateTemplate: rxMethod<IJournalTemplate>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
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
      // delete template
      removeFund: rxMethod<string>(
        pipe(
          switchMap((value) => {
            patchState(state, { isLoading: true });
            return templateService.delete(value).pipe(
              tapResponse({
                next: (template) => { patchState(state, { funds: state.funds().filter((template) => template.id !== value) }); },
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
      deleteTemplate: rxMethod<string>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          switchMap((value) => {
            return templateService.delete(value).pipe(
              tapResponse({
                next: (ref) => { patchState(state, 
                  {                    
                    tmp: state.tmp().filter((template) => template.template_ref !== ref.template_ref) 
                  });
                   },
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
      store.readDropDownAccounts();
      store.readParty();
      store.readFunds();
      store.readSubType();
      store.readAccountType();      
    },
  })
);
