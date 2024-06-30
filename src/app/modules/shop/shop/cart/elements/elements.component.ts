import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';

import { environment } from 'environments/environment.prod';

declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
})
export class ElementsComponent implements AfterViewInit {
  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('authElement') authElement: ElementRef;

  stripe: any; // : stripe.Stripe;
  card: any;
  authenication: any;
  cardErrors: any;

  loading = false;
  confirmation;
  elements: any;

  ngAfterViewInit(): void {
    console.log('Elements creation');
    this.stripe = Stripe(environment.stripe.public_key);
    this.elements = this.stripe.elements();

    this.card = this.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
      this.cardErrors = error && error.message;
    });

    const options = { mode: 'shipping' };
    this.authenication = this.elements.create('address', options);
    // this.authenication = this.elements.create();
    this.authenication.mount(this.authElement.nativeElement);
  }

  async onSubmit() {
    this.loading = true;

    const ps = "sk_test_51JogSuCGT3ceZF7pKc2zOGVPFlOkLZHjHijotazVyTVcf4bNkH7dkvwvlctuoOS9m62bf9G6TCJ76HHX46jLHkb800atj0ZUq7"

    const {
      setupIntent: updatedSetupIntent,
      error,
    } = await this.stripe.confirmCardSetup(ps, {
      payment_method: { card: this.card },
    });


    if (error) {
      console.error(error);
      return;
    }
    else
    {
      const { error: stripeError } = await this.stripe.confirmPayment({
      elements: this.card,
      confirmParams: {
        return_url: `${window.location.origin}/return.html`,
      },
      });
      if (stripeError) {
      console.error(stripeError);
      return;
      }
    }
  }


  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      // Inform the customer that there was an error.
      const cardErrors = error.message;
    } else {
      // Send the token to your server.
      this.loading = true;
      //const user = await this.auth.getUser();
      //const fun = this.functions.httpsCallable('stripeCreateCharge');
      //this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
      this.loading = false;
    }
  }
}
