import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

import { IGLType } from "app/models/types";
import { TypeService } from 'app/services/type.service';

export interface TypeStateInterface {
  types: IGLType[];  
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export const GLTypeStore = signalStore(
  { providedIn: 'root' },
  withState<TypeStateInterface>({
    types: [],
    error: null,    
    isLoading: false,
    isLoaded: false,
  }),
  
  withMethods((state, typeService = inject(TypeService)) => ({
    removeType: rxMethod<IGLType>(
          pipe(
            switchMap((value) => {
              patchState(state, { isLoading: true });
              return typeService.delete(value.gltype).pipe(
                tapResponse({
                  next: (gltype) => { patchState(state, { types: state.types().filter((type) => type.gltype !== value.gltype) }); },
                  error: console.error,
                  finalize: () => patchState(state, { isLoading: false }),
                })
              );
            })
          )
     ),
     updateType: rxMethod<IGLType>(
           pipe(
             switchMap((value) => {
               return typeService.update(value).pipe(
                 tapResponse({
                   next: type => patchState(state, { types: state.types().filter((typ) => typ.gltype !== type.gltype) }),
                   error: console.error,
                   finalize: () => patchState(state, { isLoading: false }),
                 })
               );
             })
           )
         ),
    addType: rxMethod<IGLType>(
          pipe(
            switchMap((value) => {
              patchState(state, { isLoading: true });
              return typeService.create(value).pipe(
                tapResponse({
                  next: (type) => {
                    patchState(state, { types: [...state.types(), type] });
                  },
                  error: console.error,
                  finalize: () => patchState(state, { isLoading: false }),
                })
              );
            })
          )
     ),
    
    loadType: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return typeService.read().pipe(
            tapResponse({
              next: (type) => patchState(state, { types: type, isLoaded: true }),
              error: console.error,
              finalize: () =>  { 
                patchState(state, { isLoading: false, isLoaded: true });                
                },
            })
          );
        })
      )
     ), 
     setReload: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoaded: false }))
      )
     ),   
     setLoaded: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoaded: true }))
      )
     ),   
  })),
  withHooks({
    onInit(store) {
      if (store.isLoaded() === false) {
        store.loadType();
        store.setLoaded();
      }      
    },
  })
);
