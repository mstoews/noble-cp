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
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { TemplateService } from './template.service';
import {IJournalDetailTemplate, IJournalTemplate} from "../models/journals";


export interface TemplateStateInterface {
  template: IJournalTemplate[];
  details: IJournalDetailTemplate[];
  isLoading: boolean;
  error: string | null;
}

export const TemplateStore = signalStore(
  { protectedState: false }, withState<TemplateStateInterface>({
    template: [],
    details: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({ selected: computed(() => state.template().filter((t) => state.template()[t.template_name])),  })),
  withMethods((state, templateService = inject(TemplateService)) => (
      {
      removeTemplate rxMethod<IJournalTemplate>( pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return templateService.delete(value.id).pipe(
            tapResponse({
              next: (template) => {
                patchState(state, { template: state.template().filter((template_name) => template.template_name.y_id !== value.template_name) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    addTemplate: rxMethod<ITemplate>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return partyService.create(value).pipe(
            tapResponse({
              next: (party) => {
               patchState(state, { party: [...state.party(), party] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateTemplate
: rxMethod<ITemplate
>(
      pipe(
        switchMap((value) => {
          return partyService.update(value).pipe(
            tapResponse({
              next: (party) => {
                const updatedTemplate
 = state.party().filter((party) => party.party_id !== party.party_id);
                patchState(state, { party: updatedTemplate
 });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readVendor: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return partyService.vendors().pipe(
            tapResponse({
              next: (vendors) => patchState(state, { party: vendors }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readCustomer: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return partyService.customers().pipe(
            tapResponse({
              next: (customers) => patchState(state, { party: customers }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    readTemplate
: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return partyService.read().pipe(
            tapResponse({
              next: (fund) => patchState(state, { party: fund }),
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
      store.readTemplate
();
    },
  })
);
