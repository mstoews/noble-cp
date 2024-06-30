import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../../shop-services/checkout.service';


@Component({
  selector: 'stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeCheckoutComponent implements OnInit {
  message = 'Waiting for purchase to complete...';

  waiting = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkout: CheckoutService
  ) {}

  ngOnInit() {
    this.waiting = false;

    const result = this.route.snapshot.queryParamMap.get('purchaseResult');

    if (result == 'success') {
      const ongoingPurchaseSessionId = this.route.snapshot.queryParamMap.get(
        'ongoingPurchaseSessionId'
      );
      if (ongoingPurchaseSessionId !== null) {
        this.checkout
          .waitForPurchaseCompleted(ongoingPurchaseSessionId)
          .subscribe(() => {
            this.waiting = false;
            this.message = 'Purchase SUCCESSFUL, redirecting...';
            setTimeout(() => this.router.navigateByUrl('/shop'), 3000);
          });
      }
    } else {
      this.waiting = false;
      this.message = 'Purchase CANCELED or FAILED, redirecting...';
      setTimeout(() => this.router.navigateByUrl('/shop'), 2000);
    }
  }
}

// pk_test_51JogSuCGT3ceZF7pYLMW9IZjEOaMGFqz5YOoBaNGTgT8dl72ThRvLgfx1DEFlQPteFpFlwgfpJLPnuJ1X60UCc8m00yEl0F8ra

// sk_test_51JogSuCGT3ceZF7pKc2zOGVPFlOkLZHjHijotazVyTVcf4bNkH7dkvwvlctuoOS9m62bf9G6TCJ76HHX46jLHkb800atj0ZUq7

// https://made-to-server.an.r.appspot.com/stripe-webhooks

//
