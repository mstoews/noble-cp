import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from "../app.config";
import { AuthService } from "../features/auth/auth.service";
import { addDoc, collection, deleteDoc, doc, query, setDoc, updateDoc, where } from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { map, switchMap, tap } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';


export interface ProfileModel {
  uid: string;
  userName: string;
  name: string;
  company: string;
  about: string;
  role: string;
  title: string;
  phone: string;
  photoURL: string;
  status: string;
  email: string;
  country: string;
  language: string;
  lastLogin: string;
  created: string;
  updated: string;
}

export interface PanelModel {
  uid: string;
  panelName: string;
  lastPanelOpened: string;
}

export interface AppStateInterface {
  panels: PanelModel[];
  panel: PanelModel | null;
  profile: ProfileModel | null;
  uid: string;
  isLoading: boolean;
  error: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);
  private authUser = this.authService.user;

  setPanel(panelState: PanelModel) {
    const ref = setDoc(doc(this.firestore, `users/${panelState.uid}/panels/${panelState.panelName}`), panelState) as any;
    return ref as PanelModel; 
  }
  
  
  updateProfile(profile: ProfileModel) {
    return this.setProfile(profile);
  }
  
  setProfile(profile: ProfileModel) {
    const collectionRef = collection(this.firestore,'users') 
    const ref = doc(collectionRef, profile.uid) as any;
    setDoc(ref, profile)
    return of(profile);
  }

  createProfile(profile: ProfileModel): Observable<ProfileModel> {
    addDoc(collection(this.firestore, `users/${profile.uid}`), profile);
    return of(profile);
  }


  loadProfile(uid: string) {
    const collectionRef = doc(this.firestore, `users/${uid}`) as any;
    const list$ = docData(collectionRef) as Observable<ProfileModel>;
    return list$;
  }


  update(panelState: PanelModel): Observable<PanelModel> {
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
    const p = (deleteDoc(ref).then(() => {
      panel = panel
    }));
    return of(panel);
  }

  loadPanel(uid: string): Observable<PanelModel[]> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const q = query(collectionRef);
    const list = collectionData(q) as Observable<PanelModel[]>;
    return list;
  }

  create(panel: PanelModel): Observable<PanelModel> {
    addDoc(collection(this.firestore, `users/${panel.uid}/panels`), panel);
    return of(panel);
  }

  findPanelByName(uid: string, panelName: string): Observable<PanelModel> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const q = query(collectionRef, where('panelName', '==', panelName));
    const list = collectionData(q) as Observable<PanelModel[]>;
    return list.pipe(map((col) => col[0]));
  }
}


export const AppStore = signalStore(
  { protectedState: false }, withState<AppStateInterface>({
    panels: [],
    profile: null,
    panel: null,
    uid: '',
    error: null,
    isLoading: false,
  }),
  withMethods((state, applicationService = inject(ApplicationService)) => ({
    loadUid: rxMethod<void>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap(() => {
          return applicationService.getUserId().pipe(
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
          return applicationService.create(value).pipe(
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

    setProfile: rxMethod<ProfileModel>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return applicationService.updateProfile(value).pipe(
            tapResponse({
              next: (profile) => {
                patchState(state, { profile: profile });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    createProfile: rxMethod<ProfileModel>(
      pipe(
        switchMap((value) => {
          return applicationService.createProfile(value).pipe(
            tapResponse({
              next: (profile) => {
                patchState(state, { profile: profile });
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
          return applicationService.update(value).pipe(
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

    createPanel: rxMethod<PanelModel>(
      pipe(
        switchMap((value) => {
          return applicationService.create(value).pipe(
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

    loadPanels: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((uid) => {
          return applicationService.loadPanel(uid).pipe(
            tapResponse({
              next: (panels) => patchState(state, { panels: panels }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    loadProfile: rxMethod<string>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((uid) => {
          return applicationService.loadProfile(uid).pipe(
            tapResponse({
              next: (profile) => patchState(state, { profile: profile }),
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

