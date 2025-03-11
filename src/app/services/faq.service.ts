import { inject, Injectable } from '@angular/core';
import { filter, first, map, Observable, ReplaySubject, tap } from 'rxjs';
import { ToastrService } from "ngx-toastr"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";


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
import { Faq, FaqCategory, Guide, GuideCategory } from 'app/features/help-center/help-center.type';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private faqItems: Observable<FaqCategory[]>;
  private userId: string;
  private userName: string;

  public firestore = inject(FIRESTORE); 
  public auth = inject(AUTH);
  private toast = inject(ToastrService);
  
  private user$ = authState(this.auth);

  constructor() {
    
  }


  public readFaq(): Observable<Faq[]> {
    const collectionRef = collection( this.firestore, `faq` );
    const FaqCategory = collectionData(collectionRef, { idField: 'id' }) as Observable<Faq[]>;
    return FaqCategory;
  }

  public createFaq(faq: FaqCategory) {
    const docFaq = `faq`;
    const collectionRef = collection(this.firestore, docFaq);
    addDoc(collectionRef, faq)
    .then(() =>  this.toast.success(`Frequently asked question (FAQ) has been updated ...`))
    .catch((error) =>  this.toast.error(`Error ... ${error}`) )
    .finally();    
  }

  public readAll(): Observable<FaqCategory[]> {
    const collectionRef = collection( this.firestore, `faq` );
    const FaqCategory = collectionData(collectionRef, { idField: 'id' }) as Observable<FaqCategory[]>;
    return FaqCategory;
  }
  
  readUserId(Id: string): Observable<FaqCategory[]> {    
    return this.readAll().pipe(map((images) => images.filter((filter) => filter.id === Id)) );
  }


  update(setting: FaqCategory) {
    const docRef = doc( this.firestore, `faq`, setting.id); 
    updateDoc(docRef,{ setting })
      .then(() => { this.toast.success('Frequently asked question has been updated to your profile ...') })
      .catch((error) => { this.toast.success('Profile address has been updated to your profile ...') })
      .finally();
  }

  create(category: FaqCategory) {    
      const docFaq = `faq`;
      const collectionRef = collection(this.firestore, docFaq);
      const p = addDoc(collectionRef, category)
      .then(() =>  this.toast.success(`Settings has been updated to your profile for ...`))
      .catch((error) =>  this.toast.error(`Error ... ${error}`) )
      .finally();    
  }

  delete(id: string) {
    const docFaq = `faq`;
    const ref = doc(this.firestore, docFaq, id);
    deleteDoc(ref);
  }

  private _faqs: ReplaySubject<FaqCategory[]> = new ReplaySubject<FaqCategory[]>(1);
      private _guides: ReplaySubject<GuideCategory[]> = new ReplaySubject<GuideCategory[]>(1);
      private _guide: ReplaySubject<Guide> = new ReplaySubject<Guide>(1);
      private _httpClient = inject(HttpClient);
      isLoading: boolean;
      public baseUrl = environment.baseUrl;
  
      /**
       * Getter for FAQs
       */
      get faqs$(): Observable<FaqCategory[]> {
          return this._faqs.asObservable();
      }
  
      /**
       * Getter for guides
       */
      get guides$(): Observable<GuideCategory[]> {
          return this._guides.asObservable();
      }
  
      /**
       * Getter for guide
       */
      get guide$(): Observable<GuideCategory> {
          return this._guide.asObservable();
      }
  
      // -----------------------------------------------------------------------------------------------------
      // @ Public methods
      // -----------------------------------------------------------------------------------------------------
  
      /**
       * Get all FAQs
       */
  
      getAllFaqs(): Observable<Faq[]> {

          var faqUrl = this.baseUrl + '/v1/read_faq';
          return this._httpClient.get<Faq[]>(faqUrl).pipe(
              tap((response: any) => {
                  this._faqs.next(response);
              }),
          );
          
      }
  
      /**
       * Get FAQs by category using category slug
       *
       * @param slug
       */
  
      getFaqsByCategory(slug: string): Observable<FaqCategory[]> {
          var faqUrl = this.baseUrl + '/v1/read_faq_categories';
          return this._httpClient.get<FaqCategory[]>(faqUrl).pipe(
              tap((response: any) => {
                  this._faqs.next(response);
              }),
          );
      }
  
}
