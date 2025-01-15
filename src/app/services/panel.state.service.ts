import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {FIRESTORE} from "../app.config";
import {AuthService} from "../features/auth/auth.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {addDoc, collection, doc, limit, orderBy, query, setDoc,  updateDoc, where} from "firebase/firestore";
import {collectionData } from "rxfire/firestore";
import {map, tap} from "rxjs/operators";
import {defer, Observable} from "rxjs";

export interface PanelState {
  id: string;
  panelName: string;
  lastPanelOpened: string;
}



@Injectable({
  providedIn: 'root'
})
export class PanelStateService {

  private firestore = inject(FIRESTORE);
  private authService = inject(AuthService);
  private authUser$ = toObservable(this.authService.user);


  public lastPanelOpened: WritableSignal<string> = signal<string>("");
  public lastAccountingPanel : WritableSignal<string> = signal<string>("");
  public lastBudgetPanel : WritableSignal<string> = signal<string>("");
  public lastReportingPanel : WritableSignal<string> = signal<string>("");
  public lastProjectsPanel: WritableSignal<string> = signal<string>("");

  
  public setLastPanel(panel : string ) {
    this.lastPanelOpened.set(panel);
  }

  public setLastBudgetPanel(panel : string ) {
    this.lastBudgetPanel.set(panel);
  }
  public setLastReportingPanel(panel : string ) {
    this.lastReportingPanel.set(panel);
  }
  public setLastProjectsPanel(panel : string ) {
    this.lastProjectsPanel.set(panel);
  }

  public setLastAccountingPanel(panel : string ) {
    this.lastAccountingPanel.set(panel);
  }


  addPanel(uid: string, panelState: PanelState) {
    return addDoc(collection(this.firestore, `users/${uid}/panels`), panelState) 
  }

  getUserId() {
    return this.authUser$.pipe(
      map(user => user.uid)
    );
  }

  // Update

  update(uid: string, panelState: PanelState) {
    const ref = doc(this.firestore, `users/${uid}/panels`, panelState.id) as any;
    return updateDoc(ref, panelState);
  }

  // Read

  read(uid: string, panelName: string): Observable<PanelState[]> {
    const q = query(collection(this.firestore, `users/${uid}/panels`), where(panelName, '==', panelName), orderBy('panelName'));
    return collectionData(q).pipe(
      map((panels: any) => panels.map((panel: any) => {
        return {
          id: panel.id,
          panelName: panel.panelName,
          lastPanelOpened: panel.lastPanelOpened
        }
      }))
    );
  }


}
