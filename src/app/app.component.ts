import { trigger, transition, query, style, group, animate } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { RouterOutlet } from '@angular/router';
import { ApplicationService } from './services/application.service';
import { AuthService } from './features/auth/auth.service';
import { Store } from '@ngrx/store';
import { getTemplates, loadTemplates } from './features/accounting/transactions/state/template/Template.Action';
import { ApplicationStore } from './store/application.store';

@Component({
    selector: 'app-root',
    template: `<router-outlet/>`,
    styles: `:host {
                display: flex;
                flex: 1 1 auto;
                width: 100%;
                height: 100%;
            }`,
    imports: [KanbanModule, RouterOutlet],
    providers: [ApplicationStore],
    animations: [
        trigger('routerTransition', [
            transition('* <=> *', [
                query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
                    optional: true,
                }),
                group([
                    query(':enter', [
                        style({ transform: 'translateX(100%)' }),
                        animate('1.0s ease-in-out', style({ transform: 'translateX(0%)' })),
                    ], { optional: true }),
                    query(':leave', [
                        style({ transform: 'translateX(0%)' }),
                        animate('1.0s ease-in-out', style({ transform: 'translateX(-100%)' })),
                    ], { optional: true }),
                ]),
            ]),
        ]),
    ]
})
export class AppComponent {
    authService = inject(AuthService);
    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }
    constructor() {

    }
}


