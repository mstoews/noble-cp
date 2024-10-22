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
import { IRole, RoleService } from './roles.service';


export interface RoleStateInterface {
  roles: IRole[];
  isLoading: boolean;
  error: string | null;
}

export const RolesStore = signalStore(
  withState<RoleStateInterface>({
    roles: [],
    error: null,
    isLoading: false,
  }),
  withComputed((state) => ({
    selected: computed(() => state.roles().filter((t) => state.roles()[t.role])),
  })),
  withMethods((state, roleService = inject(RoleService)) => ({       
    removeRole: rxMethod<IRole>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return roleService.delete(value.role).pipe(
            tapResponse({
              next: () => {
                patchState(state, { roles: state.roles().filter((prd) => prd.role !== value.role) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    addRole: rxMethod<IRole>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return roleService.create(value).pipe(
            tapResponse({
              next: (role) => {
               patchState(state, { roles: [...state.roles(), role] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    updateRole: rxMethod<IRole>(
      pipe(
        switchMap((value) => {
          return roleService.update(value).pipe(
            tapResponse({
              next: (role) => {
                patchState(state, { roles: role });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    loadRoles: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return roleService.read().pipe(
            tapResponse({
              next: (role) => patchState(state, { roles: role }),
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
      store.loadRoles();
    },
  })
);
