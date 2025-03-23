import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { TeamService } from '../services/team.service';
import { ITeam } from 'app/models/team';

export interface TeamStateInterface {
  team: ITeam[];
  isLoading: boolean;
  error: string | null;
}

export const TeamStore = signalStore(
  { protectedState: false }, withState<TeamStateInterface>({
    team: [],
    error: null,
    isLoading: false,
  }),
  withMethods((state, teamService = inject(TeamService)) => ({
    removeMember: rxMethod<ITeam>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return teamService.delete(value.uid,).pipe(
            tapResponse({
              next: () => {
                patchState(state, { team: state.team().filter((prd) => prd.uid !== value.uid) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addMember: rxMethod<ITeam>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return teamService.create(value).pipe(
            tapResponse({
              next: (team) => {
                patchState(state, { team: [...state.team(), team] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    updateMember: rxMethod<ITeam>(
      pipe(
        switchMap((value) => {
          return teamService.update(value).pipe(
            tapResponse({
              next: (team) => {
                patchState(state, { team: team });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadTeam: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return teamService.read().pipe(
            tapResponse({
              next: (team) => patchState(state, { team: team }),
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
      store.loadTeam();
    },
  })
);
