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
  import { IJournalDetailTemplate, IJournalTemplate } from 'app/models/journals';
  import { JournalTemplateService } from '../services/journal-template.service';
  
  
  export interface JournalTemplateInterface {
    templates: IJournalTemplate[];
    templateDetails: IJournalDetailTemplate[];    
    isLoading: boolean;
    isTemplateLoaded: boolean;
    error: string | null;
  }
  
  export const TemplateStore = signalStore (
    { protectedState: false }, withState<JournalTemplateInterface>({
      templates: [],
      templateDetails: [],
      error: null,
      isLoading: false,
      isTemplateLoaded: false,
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
    })),  
    withHooks({
      onInit(store) {
        if (store.isTemplateLoaded() === false) {
          store.loadTemplates();        
        }
      },
    })
  );
  