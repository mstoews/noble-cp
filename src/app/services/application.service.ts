import { inject, Injectable } from '@angular/core';
import { filter, first, map, Observable } from 'rxjs';
import { ToastrService } from "ngx-toastr"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

export interface ApplicationModel {
  id?: string;
  settingsName: string;
  description: string;
  userId: string;
  settings: string;
  created: number;
  userName: string;
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
import { authState } from 'rxfire/auth';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private applicationItems: Observable<ApplicationModel[]>;
  private userId: string;
  private userName: string;

  public firestore = inject(FIRESTORE); 
  public auth = inject(AUTH);
  private toast = inject(ToastrService);
  
  private user$ = authState(this.auth);

  constructor() {
    
  }

  public updateDisplayname(displayName: string) 
  {
    this.user$

    const user = this.auth.currentUser;
    updateProfile(user, { displayName })
      .then(() => {
        sendEmailVerification(user)
          .then(() => {
              this.toast.success(`Profile address has been updated to your profile ...`)
          }).catch((error) => {
            this.toast.error(`Error ... ${error}`);
          });
      }).catch((error) => {
        this.toast.error(`Error ... ${error}`);
      });
  }
  
  public readAll(): Observable<ApplicationModel[]> {
    const collectionRef = collection( this.firestore, `users/${this.userId}/grid_settings` );
    const gridSettings = collectionData(collectionRef, { idField: 'id' }) as Observable<ApplicationModel[]>;
    return gridSettings;
  }
  
  readUserId(userId: string): Observable<ApplicationModel[]> {    
    return this.readAll().pipe(map((images) => images.filter((filter) => filter.userId === userId)) );
  }

  readSettingsName(settingsName: string): Observable<ApplicationModel[]> {    
    return this.readAll().pipe(map((images) => images.filter((filter) => filter.settingsName === settingsName)) );
  }

  update(setting: ApplicationModel) {
    const docRef = doc( this.firestore, `users/${this.userId}/application`, setting.id); 
    updateDoc(docRef,{ setting })
      .then(() => { this.toast.success('Profile address has been updated to your profile ...') })
      .catch((error) => { this.toast.success('Profile address has been updated to your profile ...') })
      .finally();
  }

  create(settings: ApplicationModel) {    
      const docLocation = `users/${settings.userId}/application`;
      const collectionRef = collection(this.firestore, docLocation);
      const p = addDoc(collectionRef, settings)
      .then(() =>  this.toast.success(`Settings has been updated to your profile for ...`))
      .catch((error) =>  this.toast.error(`Error ... ${error}`) )
      .finally();    
  }

  delete(id: string) {
    const docLocation = `users/${this.userId}/application`;
    const ref = doc(this.firestore, docLocation, id);
    deleteDoc(ref);
  }
}
