import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {FIRESTORE} from "../app.config";
import {AuthService} from "../features/auth/auth.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {addDoc, collection, deleteDoc, doc, limit, orderBy, query, setDoc,  updateDoc, where} from "firebase/firestore";
import {collectionData } from "rxfire/firestore";
import {exhaustMap, map, switchMap, tap} from "rxjs/operators";
import { Observable, of, pipe} from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { IFunds } from 'app/models';
import { Panel } from '@syncfusion/ej2-angular-layouts';
import { load } from '@syncfusion/ej2-grids';


export interface PanelModel {
  uid: string;
  panelName: string;
  lastPanelOpened: string;
}

export interface AppStateInterface {
  panels: PanelModel[];
  panel: PanelModel | null;
  userName: string;
  uid: string;
  isLoading: boolean;
  error: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class PanelService {

  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);
  private authUser = this.authService.user;
  
  setPanel(panelState: PanelModel) {    
    return setDoc(doc(this.firestore, `users/${panelState.uid}/panels/${panelState.panelName}`),  panelState); 
  }

  update ( panelState: PanelModel) {
    return of(this.setPanel(panelState));
  }
  
  // get user id  
  public getUserId(): Observable<string> { 
    return of(this.authUser().uid);
  }

  getLastPanel(uid: string, panelName) {
    const ref = doc(this.firestore, `users/${uid}/panels`, panelName) as any;
    const panel = collectionData<PanelModel>(ref) as any;
    return panel as Observable<PanelModel>;
  }

  // delete
  delete(panel: PanelModel): Observable<PanelModel> {
    const ref = doc(this.firestore, `users/${panel.uid}/panels`, panel.panelName) as any;
    var panel: PanelModel; 
    const p =  (deleteDoc(ref).then(() => {
      panel = panel
    }));
    return of(panel);
  }

  loadByUserId(uid: string ): Observable<PanelModel[]> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const q = query(collectionRef);
    const list = collectionData(q)  as Observable<PanelModel[]>;    
    return list;
  }

  create(panel: PanelModel): Observable<PanelModel> {
    const ref = addDoc(collection(this.firestore, `users/${panel.uid}/panels`), panel) as any;
    return of(panel);
  } 

  findPanelByName(uid: string , panelName: string): Observable<PanelModel> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const q = query(collectionRef, where('panelName', '==', panelName));
    const list = collectionData(q)  as Observable<PanelModel[]>;    
    return list.pipe(map((col) => col[0]));
  }
}
  

export const AppStore = signalStore(
  { protectedState: false }, withState<AppStateInterface>({
    panels: [],
    panel: null,
    userName: '',
    uid: '',
    error: null,
    isLoading: false,
  }),  
  withMethods((state, panelService = inject(PanelService)) => ({       
    loadUid: rxMethod<void> (
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() => {
          return panelService.getUserId().pipe(
            tapResponse({
              next: (uid) => patchState(state, { uid: uid }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
        
    setPanel: rxMethod<PanelModel>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return panelService.create(value).pipe(
            tapResponse({
              next: (panel) => {
               patchState(state, { panels: [...state.panels(), panel] });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    updatePanel: rxMethod<PanelModel>(
      pipe(        
        switchMap((value) => {
          return panelService.update(value).pipe(
            tapResponse({              
                next: (panel) => {
                  const updatedFund = state.panels().filter((panels) => panels.panelName !== panels.panelName);
                  patchState(state, { panels: updatedFund });                
                },               
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadPanels: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((uid) => {
          return panelService.loadByUserId(uid).pipe(
            tapResponse({
              next: (panels) => patchState(state, { panels: panels }),
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
      store.loadUid();    
      store.loadPanels(store.uid); 
    },
  })
);

