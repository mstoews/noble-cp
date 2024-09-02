import { trigger, transition, query, style, group, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet],
    animations: [
        trigger('routerTransition', [
          transition('* <=> *', [
            query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
              optional: true,
            }),
            group([
              query(
                ':enter',
                [
                  style({ transform: 'translateX(100%)' }),
                  animate(
                    '1.0s ease-in-out',
                    style({ transform: 'translateX(0%)' })
                  ),
                ],
                { optional: true }
              ),
              query(
                ':leave',
                [
                  style({ transform: 'translateX(0%)' }),
                  animate(
                    '1.0s ease-in-out',
                    style({ transform: 'translateX(-100%)' })
                  ),
                ],
                { optional: true }
              ),
            ]),
          ]),
        ]),
      ],
})
export class AppComponent {
    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }
}
    

