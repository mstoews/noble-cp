import { inject, Injectable } from '@angular/core';
import { filter, first, map, Observable, share, shareReplay } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IGridSettingsModel {
  id?: string;
  settingsName: string;
  description: string;
  grid: string;
  userId: string;
  settings: string;
  created: number;
}

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { collectionData } from 'rxfire/firestore';
import { FIRESTORE, AUTH } from 'app/app.config';

@Injectable({
  providedIn: 'root',
})
export class GridSettingsService {
  private gridProfileItems: Observable<IGridSettingsModel[]>;
  private userId: string;
  private userName: string;

  public firestore = inject(FIRESTORE); 
  public auth = inject(AUTH);
  private snack = inject(MatSnackBar);

  constructor() {
    this.userId = this.auth.currentUser.uid;
  }

  public readAll(): Observable<IGridSettingsModel[]> {
    const collectionRef = collection( this.firestore, `users/${this.userId}/grid_settings` );
    const gridSettings = collectionData(collectionRef, { idField: 'id' }) as Observable<IGridSettingsModel[]>;
    return gridSettings;
  }
  
  readUserId(userId: string): Observable<IGridSettingsModel[]> {    
    return this.readAll().pipe(map((images) => images.filter((filter) => filter.userId === userId)) ).pipe(shareReplay(1));
  }

  readSettingsName(settingsName: string): Observable<IGridSettingsModel[]> {    
    return this.readAll().pipe(map((images) => images.filter((filter) => filter.settingsName === settingsName)) );
  }

  update(setting: IGridSettingsModel) {
    const docRef = doc( this.firestore, `users/${this.userId}/grid-settings`, setting.id); 
    updateDoc(docRef,{ setting })
      .then(() => {
        this.snack.open(
          'Profile address has been updated to your profile ...',
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          }
        );
      })
      .catch((error) => {
        this.snack.open(
          'Profile address was NOT updated to your profile ...',
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
          }
        );
      })
      .finally();
  }

  create(settings: IGridSettingsModel) {
    try {
      const docLocation = `users/${settings.userId}/grid_settings`;
      const collectionRef = collection(this.firestore, docLocation);
      const p = addDoc(collectionRef, settings).then((docRef) => {
        this.snack.open(
          `Grid settings has been updated to your profile for : ${settings.grid} ...`,
          'OK',
          {
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'bg-danger',
            duration: 3000,
          }
        );

      });
    } catch (error) {
      this.snack.open(`Error adding settings definition ... ${error} `, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'bg-danger',
        duration: 3000,
      });
    }
  }

  

  delete(id: string) {
    const docLocation = `users/${this.userId}/grid_settings`;
    const ref = doc(this.firestore, docLocation, id);
    deleteDoc(ref);
  }
}
