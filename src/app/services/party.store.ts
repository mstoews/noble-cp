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
import { PartyService } from './party.service';
import { IParty } from 'app/models/party';


export interface PartyStateInterface {
  party: IParty[];
  isLoading: boolean;
  error: string | null;
}

export const PartyStore = signalStore(
  { protectedState: false }, withState<PartyStateInterface>({
    party: [],
    error: null,
    isLoading: false,
  
  }),
  withComputed((state) => ({
    selected: computed(() => state.party().filter((t) => state.party()[t.party_id])),
  })),
  withMethods((state, partyService = inject(PartyService)) => ({       
    removeParty: rxMethod<IParty>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return partyService.delete(value.party_id).pipe(
            tapResponse({
              next: (party) => {
                patchState(state, { party: state.party().filter((party) => party.party_id !== value.party_id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addParty:  rxMethod<IParty>(
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
    updateParty: rxMethod<IParty>(
      pipe(
        switchMap((value) => {
          return partyService.update(value).pipe(
            tapResponse({
              next: (party) => {
                const updatedParty = state.party().filter((party) => party.party_id !== party.party_id);
                patchState(state, { party: updatedParty });                
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

    readParty: rxMethod<void>(
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
      store.readParty();
    },
  })
);
