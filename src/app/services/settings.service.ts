import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { environment } from 'environments/environment.prod';
import { exhaustMap, pipe, shareReplay, switchMap, tap } from 'rxjs';

interface ISetting {
  id: string;
  name: string;
  value: string;
  setting_description: string;
  create_user: string;
  create_date: string;
  update_user: string;
  update_date: string;
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
 
    httpClient = inject(HttpClient)
    private baseUrl = environment.baseUrl;
  
    create(setting: ISetting) {
      var url = this.baseUrl + '/v1/create_setting';
      return this.httpClient.post<ISetting>(url, setting).pipe(shareReplay()) 
    }

    read() {
      var url = this.baseUrl + '/v1/read_setting';
      return this.httpClient.get<ISetting[]>(url).pipe(shareReplay()) 
    }
    
    read_by_id() {
        var url = this.baseUrl + '/v1/read_setting_by_id';
        return this.httpClient.get<ISetting[]>(url).pipe(shareReplay()) 
    }

    delete (setting: ISetting){        
        var url = this.baseUrl + '/v1/delete_setting';
        return this.httpClient.post<ISetting[]>(url, setting ).pipe(shareReplay()) 
        }

    update(setting: ISetting){
        var url = this.baseUrl + '/v1/update_setting';
        return this.httpClient.post<ISetting[]>(url, setting).pipe(shareReplay()) 
    }     
}


export interface SettingStateInterface {
    settings: ISetting[];
    isLoading: boolean;
    error: string | null;
}


export const SettingsStore = signalStore(
    { protectedState: false }, withState<SettingStateInterface>({
      settings: [],
      error: null,
      isLoading: false,    
    }),
    withMethods((state, settingService = inject(SettingsService)) => ({       
      removeSetting: rxMethod<ISetting>(
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
      addSetting: rxMethod<ISetting>(
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
      updateSetting: rxMethod<ISetting>(
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
        store.readSettings();
      },
    })
  );
  



  
