import { inject, Injectable } from '@angular/core';
import { FIRESTORE } from "../app.config";
import { AuthService } from "../features/auth/auth.service";
import { addDoc, collection, deleteDoc, doc, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { map, switchMap, tap } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { tapResponse } from '@ngrx/operators';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { list } from 'rxfire/database';


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

export interface TbDataParam {
  account: number;
  period: number;
  periodYear: number;  
}

export interface TbPeriod {
  period: number;
  periodYear: number;
}

export interface PanelModel {
  uid: string;
  panelName: string;
  lastPanelOpened: string;
}

export interface TbData {
  account: number;
  child: number
  openingBalance: number;
  closingBalance: number;
  debitBalance: number;
  creditBalance: number;
  description: string;
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

  
  // This function seems to give an error on the map function under the hood of collectionData 
  findPanelByNameOld(uid: string, panelName: string): Observable<PanelModel> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const q = query(collectionRef, where('panelName', '==', panelName)) as any
    const list = collectionData(q) as Observable<PanelModel[]>;
    return list.pipe(map((col) => col[0]));
  }

  findPanelByName(uid: string, panelName: string): Observable<PanelModel> {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const acct = doc(collectionRef, panelName);
    return docData(acct) as Observable<PanelModel | undefined>;
  }

  getDashboardAccount(periodYear: number,  period: number, account: number): Observable<TbData> {  
    const ref = doc(this.firestore, `trial_balance/${periodYear}/${period}`, account.toString()) as any;
    const acct$ = docData(ref) as Observable<TbData>;
    return acct$;
  }

  getTrialBalance(periodYear: number,  period: number) {  
    const ref = collection(this.firestore, `trial_balance/${periodYear}/${period}`) as any;
    return  collectionData(ref) as Observable<TbData[]>;    
  }



  findDashboardByAccount(periodYear: number,  period: number, account: number): Observable<TbData | undefined> {
    const collectionRef = collection(this.firestore, `trial_balance/${periodYear}/${period}`, account.toString());
    const acct = doc(collectionRef, account.toString());
    return docData(acct) as Observable<TbData | undefined>;
  }


  getLastPanel(uid: string, panelName) {
    const collectionRef = collection(this.firestore, `users/${uid}/panels`);
    const acct = doc(collectionRef, panelName);
    return docData(acct) as Observable<PanelModel | undefined>;
  }

  // getTB(periodYear: number, period: number): Observable<TbData[]> {
  //   const collectionRef = collection(this.firestore, `trial_balance/${periodYear}/${period}`);
  //   return collectionData(ref) as Observable<TbData[]>;    
  // }

  getTb(periodYear: number, period: number): Observable<TbData[]> {
    const col = `trial_balance/${periodYear}/${period}`
    const collectionRef = collection(this.firestore, col );
    const q = query(collectionRef, orderBy('account', 'asc'));
    return collectionData(q, { idField: 'account' }) as Observable<TbData[]>;
  }


}

export interface AppStateInterface {
  panels: PanelModel[];
  panel: PanelModel | null;
  profile: ProfileModel | null;
  trialBalance: TbData[];
  cashAccount: TbData | null;
  payableAccount: TbData | null;
  operatingFundAccount: TbData | null;
  uid: string;
  isLoading: boolean;
  error: string | null;
}

export const MainPanelStore = signalStore(
  { providedIn: 'root' },
   withState<AppStateInterface>({
    panels: [],
    trialBalance: [],
    profile: null,
    panel: null,
    cashAccount: null,
    payableAccount: null,
    operatingFundAccount: null,
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
    loadTrialBalance: rxMethod<TbPeriod>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        switchMap((value) => {
          return applicationService.getTb(value.periodYear, value.period).pipe(
            tapResponse({
              next: (trialBalance) => patchState(state, { trialBalance: trialBalance }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    setCashAccount: rxMethod<TbDataParam>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return applicationService.getDashboardAccount(value.periodYear, value.period, value.account).pipe(
            tapResponse({
              next: (account) => {
                patchState(state, { cashAccount: account });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),

    setPayableAccount: rxMethod<TbDataParam>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return applicationService.getDashboardAccount(value.periodYear, value.period, value.account).pipe(
            tapResponse({
              next: (account) => {
                patchState(state, { payableAccount: account });
              },
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            })
          );
        })
      )
    ),
    setOperatingFundAccount: rxMethod<TbDataParam>(
      pipe(
        switchMap((value) => {
          patchState(state, { isLoading: true });
          return applicationService.getDashboardAccount(value.periodYear, value.period, value.account).pipe(
            tapResponse({
              next: (account) => {
                patchState(state, { operatingFundAccount: account });
              },
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
      store.loadProfile(store.uid); 
      store.loadTrialBalance({periodYear: 2024, period: 1});  
    },
  })
);

