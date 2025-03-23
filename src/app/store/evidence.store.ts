import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { EvidenceService } from '../services/evidence.service';
import { IArtifacts } from 'app/models/journals';

export interface EvidenceStateInterface {
  evidence: IArtifacts[];
  isLoading: boolean;
  error: string | null;
}

export const EvidenceStore = signalStore(
  { protectedState: false },
  
  withState<EvidenceStateInterface>({
    evidence: [],
    error: null,
    isLoading: false,
  }),
  
  withComputed((state) => ({
    selected: computed(() => state.evidence().filter((t) => state.evidence()[t.id])),
  })),
  
  withMethods((state, evidenceService = inject(EvidenceService)) => ({
    addEvidence: rxMethod<IArtifacts>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return evidenceService.create(value).pipe(
            tapResponse({
              next: evidence => patchState(state, { evidence: [...state.evidence(), evidence] }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateEvidence: rxMethod<IArtifacts>(
      pipe(
        switchMap((value) => {
          return evidenceService.update(value).pipe(
            tapResponse({
              next: (evidence) => patchState(state, { evidence: state.evidence().filter((evidence) => evidence.id !== evidence.id) }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readEvidence: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return evidenceService.read().pipe(
            tapResponse({
              next: evidence => patchState(state, { evidence }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    readEvidenceById: rxMethod<number>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap((id) => {
          return evidenceService.readById(id).pipe(
            tapResponse({
              next: evidence => patchState(state, { evidence }),
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
      store.readEvidence();
    },
  })
);
