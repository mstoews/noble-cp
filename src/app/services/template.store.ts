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
  withMethods((state, templateService = inject(TemplateService)) => ({
    addTemplate: rxMethod<IJournalTemplate>( pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return templateService.create(value).pipe(
            tapResponse({
              next: (template) => {
               patchState(state, { template :   [...state.template(), template] });
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
                const updatedTemplate = state.template().filter((template) =>template.template_name !== template.template_name);
                patchState(state, { template : updatedTemplate});
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
              next: (template) => patchState(state, { template: template }),
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
