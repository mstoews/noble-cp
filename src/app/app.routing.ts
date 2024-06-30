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
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
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
                loadChildren: () =>
                    import(
                        'app/modules/accounting/accts/main/gl.main.components.routes'
                    ),
            },
            {
                path: 'help',
                loadChildren: () =>
                    import('app/modules/help-center/help-center.routes'),
            },
            {
                path: 'analysis',
                loadChildren: () =>
                    import('app/modules/analysis/analysis.component.routes'),
            },
            {
                path: 'journals',
                loadChildren: () =>
                    import(
                        'app/modules/accounting/transactions/journal.entry.routes'
                    ),
            },
            // {
            //     path: 'journals',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/accounting/journals/journal-routes'
            //         ),
            // },
            // { path: 'home', loadChildren: () => import('app/modules/admin/dashboard-page/dashboard-page.routes')},
            {
                path: 'analytics',
                loadChildren: () =>
                    import('app/modules/admin/finance/finance.routes'),
            },
            {
                path: 'projects',
                loadChildren: () =>
                    import('app/modules/admin/dashboard/project.routes'),
            },
            {
                path: 'reporting',
                loadChildren: () =>
                    import('app/modules/reporting/reporting.routes'),
            },
            {
                path: 'income-statements',
                loadChildren: () =>
                    import('app/modules/reporting/spread/spreadsheet.routes'),
            },

            {
                path: 'expense-reports',
                loadChildren: () =>
                    import('app/modules/reporting/expense/expense.routes'),
            },
            {
                path: 'kanban',
                loadChildren: () =>
                    import('app/modules/kanban/kanban/kanban.routes'),
            },
            {
                path: 'budget',
                loadChildren: () =>
                    import('app/modules/budget/budget.entry.routes'),
            },

            {
                path: 'learning',
                loadChildren: () =>
                    import('app/modules/admin/academy/academy.routes'),
            },
            {
                path: 'general_ledger',
                loadChildren: () =>
                    import('app/modules/accounting/accts/general-ledger/general-ledger.components.routes'),
            },

            {
                path: 'glaccts',
                loadChildren: () =>
                    import('app/modules/accounting/accts/gl-accts.routes'),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('app/modules/pages/settings/settings.routes'),
            },
            {
                path: 'docs',
                loadChildren: () =>
                    import('app/modules/file-manager/file-manager.routes'),
            },
            {
                path: '**', loadChildren: () =>
                    import('app/modules/pages/error/error-404/error-404.routes')
            },
        ],
    },
    { path: '**', pathMatch: 'full', redirectTo: 'landing' },
];
