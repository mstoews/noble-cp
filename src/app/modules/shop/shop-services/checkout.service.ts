import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutSession } from '../models/checkout';
import { filter, map } from 'rxjs/operators';


import { Auth } from '@angular/fire/auth';
import {
  collectionData,
  docData,
  Firestore,
  doc,
  collection,
} from '@angular/fire/firestore';
import { environment } from 'environments/environment.prod';

interface purchaseSessions {
  id: string;
  status: string;
}

declare var Stripe: any;

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private jwtAuth: string | null;
  private auth: Auth = inject(Auth);

  constructor(private http: HttpClient, private firestore: Firestore) {
    this.auth.onIdTokenChanged((user) => {
      if (user) {
        user.getIdToken().then((jwt) => (this.jwtAuth = jwt));
      }
    });
  }

  startPaymentIntent(cartId: any): Observable<CheckoutSession> {
    const headers = new HttpHeaders().set(
      'Authorization',
      this.jwtAuth as string
    );
    if (environment.production === false) {
      return this.http.post<CheckoutSession>(
        environment.baseUrl + '/api/payment-intent',
        {
          cartId,
          callbackUrl: this.buildCallbackUrl(),
        },
        { headers }
      );
    } else {
      return this.http.post<CheckoutSession>(
        environment.baseUrl + '/api/payment-intent',
        {
          cartId,
          callbackUrl: this.buildCallbackUrl(),
        },
        { headers }
      );
    }
  }

  startProductCheckoutSession(cartId: any): Observable<CheckoutSession> {
    const headers = new HttpHeaders().set(
      'Authorization',
      this.jwtAuth as string
    );

    if (environment.production === false) {
      return this.http.post<CheckoutSession>(
        environment.baseUrl + '/api/checkout',
        {
          cartId,
          callbackUrl: this.buildCallbackUrl(),
        },
        { headers }
      );
    } else {
      return this.http.post<CheckoutSession>(
        environment.baseUrl + '/api/checkout',
        {
          cartId,
          callbackUrl: this.buildCallbackUrl(),
        },
        { headers }
      );
    }
  }

  buildCallbackUrl() {
    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;

    let callBackUrl = `${protocol}//${hostName}`;

    if (port) {
      callBackUrl += ':' + port;
    }

    callBackUrl += '/shop/purchase-thanks';

    return callBackUrl;
  }

  redirectToCheckout(session: CheckoutSession) {
    const stripe = Stripe(session.stripePublicKey);
    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId,
    });
  }

  waitForPurchaseCompleted(ongoingPurchaseSessionId: string): Observable<any> {
    const sessionsRef = collection(
      this.firestore,
      `purchaseSessions/${ongoingPurchaseSessionId}`
    );
    const col = collectionData(sessionsRef, { idField: 'id' }) as Observable<
      purchaseSessions[]
    >;
    return col.pipe(
      map((sessions) => sessions[0]),
      filter((purchase) => purchase.status == 'completed')
    );
  }
}
