import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState,
  } from '@ngrx/signals';
  
  import { rxMethod } from '@ngrx/signals/rxjs-interop';
  import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
  import { inject } from '@angular/core';
  import { tapResponse } from '@ngrx/operators';
  import { IAccounts } from 'app/models/journals';
  import { IJournalDetailTemplate, IJournalTemplate } from 'app/models/journals';
  import { IType } from 'app/models/kanban';
  import { IParty } from 'app/models/party';
  import { JournalTemplateService } from './journal-template.service';
  
  
  export interface JournalTemplateInterface {
    templates: IJournalTemplate[];
    templateDetails: IJournalDetailTemplate[];
    accounts: IAccounts[];
    account_type: IType[];
    party: IParty[];
    isLoading: boolean;
    error: string | null;
  }
  
  export const TemplateStore = signalStore (
    { protectedState: false }, withState<JournalTemplateInterface>({
      templates: [],
      templateDetails: [],
      accounts: [],
      account_type: [],
      party: [],
      error: null,
      isLoading: false,
    }),
    withComputed((state) => ({
    })),
    withMethods((state, templateService = inject(JournalTemplateService)) => ({

      loadTemplates: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return templateService.read().pipe(
              tapResponse({
                next: (template) => patchState(state, { templates: template }),              
                error: console.error,
                finalize: () => patchState(state, { isLoading: false }),
              })
            );
          })
        )
      ),
     
      loadAccounts: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { isLoading: true })),
          exhaustMap(() => {
            return templateService.readAccounts().pipe(
              tapResponse({
                next: (accounts) => patchState(state, { accounts: accounts }),
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
        store.loadTemplates();
        store.loadAccounts();
      },
    })
  );
  