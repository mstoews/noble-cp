import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { signalStore, withState, withMethods, patchState, withHooks } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { SettingsService } from "app/services/settings.service";
import { pipe, switchMap, tap, exhaustMap } from "rxjs";
import { ISettings } from "app/models";

export interface SettingStateInterface {
  settings: ISettings[];
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
}

export const SettingsStore = signalStore(
  { providedIn: 'root' }, withState<SettingStateInterface>({
    settings: [],
    error: null,
    isLoading: false,
    isLoaded: false,
  }),
  withMethods((state, 
    settingService = inject(SettingsService)) => ({
    
    removeSetting: rxMethod<ISettings>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return settingService.delete(value).pipe(
            tapResponse({
              next: (setting) => {
                patchState(state, { settings: state.settings().filter((setting) => setting.id !== value.id) });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    addSetting: rxMethod<ISettings>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return settingService.create(value).pipe(
            tapResponse({
              next: (setting) => {
                patchState(state, { settings: [...state.settings(), setting] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updateSetting: rxMethod<ISettings>(
      pipe(
        switchMap((value) => {
          return settingService.update(value).pipe(
            tapResponse({
              next: (setting) => {
                const updatedSetting = state.settings().filter((setting) => setting.id !== setting.id);
                patchState(state, { settings: updatedSetting });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),    
    readSettings: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        exhaustMap(() => {
          return settingService.read().pipe(
            tapResponse({
              next: (setting) => patchState(state, { settings: setting }),
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
      if (store.isLoaded() === false) {
        store.readSettings();
      }
    },
  })
);

