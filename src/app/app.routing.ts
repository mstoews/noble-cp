import { LayoutComponent } from 'app/layout/layout.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'landing' },
    {
        path: 'auth',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        loadChildren: () =>
            import('app/core/auth.signal/auth.routes').then(
                (m) => m.AUTH_ROUTES
            ),
    },

    // Auth routes for guests
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'auth/login',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'landing',
                loadChildren: () =>
                    import('app/modules/landing/landing.routing'),
            },

        ],
    },
    {
        path: '',
        canActivate: [isAuthenticatedGuard],
        canActivateChild: [isAuthenticatedGuard],

        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {

                path: 'sign-out',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },
    {
        path: '',
        canActivate: [isAuthenticatedGuard],
        canActivateChild: [isAuthenticatedGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'gl',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import(
                        'app/modules/accounting/accts/accounts/gl.main.components.routes'
                    ),
            },
            {
                path: 'help',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/help-center/help-center.routes'),
            },
            {
                path: 'analysis',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/analysis/analysis.component.routes'),
            },
            {
                path: 'journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import(
                        'app/modules/accounting/transactions/journal.entry.routes'
                    ),
            },
            {
                path: 'analytics',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/admin/finance/finance.routes'),
            },
            {
                path: 'projects',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/admin/dashboard/project.routes'),
            },
            {
                path: 'reporting',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/reporting/reporting.routes'),
            },

            {
                path: 'expense-reports',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/reporting/expense/expense.routes'),
            },
            {
                path: 'kanban',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/kanban/kanban/kanban.routes'),
            },
            {
                path: 'finance',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/finance/finance.routes'),
            },
            {
                path: 'chat',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/chat/chat.routes'),
            },
            {
                path: 'budget',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/budget/budget.entry.routes'),
            },

            {
                path: 'learning',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/admin/academy/academy.routes'),
            },
            {
                path: 'glaccts',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/accounting/accts/accounts/gl-accts.routes'),
            },
            {
                path: 'settings',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/pages/settings/settings.routes'),
            },
            {
                path: 'docs',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/modules/file-manager/file-manager.routes'),
            },
            // {
            //     path: '**', loadChildren: () =>
            //         import('app/modules/pages/error/error-404/error-404.routes')
            // },
        ],
    },
    { path: '**', pathMatch: 'full', redirectTo: 'auth' },
];
