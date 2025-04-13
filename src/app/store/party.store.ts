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
import { PartyService } from '../services/party.service';
import { IParty } from 'app/models/party';


export interface PartyStateInterface {
  party: IParty[];
  isLoading: boolean;
  error: string | null;
}

export const PartyStore = signalStore(
{ providedIn: 'root' },
  withState<PartyStateInterface>({
    party: [],
    error: null,
    isLoading: false,

  }),
  withComputed((state) => ({
    selected: computed(() => state.party().filter((t) => state.party()[t.party_id])),
  })),
  withMethods((state, 
    partyService = inject(PartyService)) => ({

    removeParty: rxMethod<IParty>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return partyService.delete(value.party_id).pipe(
            tapResponse({
              next: () => {
                patchState(state, { party: state.party().filter((party) => party.party_id !== value.party_id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    addParty: rxMethod<IParty>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return partyService.create(value).pipe(
            tapResponse({
              next: (party) => {
                patchState(state, { party: [...state.party(), party[0]] });
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
              next: pt => {
                  var updated = state.party().filter((jrn) => jrn.party_id !== pt[0].party_id);
                  updated.push(pt[0]);
                  patchState(state, { party: updated });                   
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            }));
        },                            
      ))
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


export interface VendorVm {
  readonly party: IParty[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

export interface VendorSlice {
  readonly party: IParty[];
  readonly isLoading: boolean;
  readonly error: string | null;
}
export function buildVendorVm(isLoading: boolean,  error: string | null, party: IParty[] | null)
   : VendorVm {  
  return {
    party: party,
    isLoading: isLoading,
    error: error,   
  }
}

export const initialVendor: VendorSlice = {
  isLoading: false,
  error: null,
  party: [], 
}
  
export const VendorStore = signalStore(
  { providedIn: 'root' },
  withState(initialVendor),
  withMethods((state, 
    partyService = inject(PartyService)) => ({

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
    addParty: rxMethod<IParty>(
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
                const updatedParty = state.party().filter((party) => party.party_id !== party[0].party_id);
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
              next: (party) => patchState(state, { party: party }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks(store => ({
      onInit() {
          store.readParty();
      }
  }))
)

