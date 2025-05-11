import { LayoutComponent } from 'app/fuse/layout/layout.component';
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
            import('app/fuse/core/auth.signal/auth.routes').then(
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
                        'app/features/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/features/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/features/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'auth/login',
                loadChildren: () =>
                    import('app/features/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/features/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'landing',
                loadChildren: () =>
                    import('app/features/landing/landing.routing'),
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
                    import('app/features/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/features/auth/unlock-session/unlock-session.routes'
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
                        'app/features/accounting/static/gl.main.components.routes'
                    ),
            },
            {
                path: 'help',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/help-center/help-center.routes'),
            },
            {
                path: 'analysis',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/analysis/analysis.component.routes'),
            },
            {
                path: 'journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/accounting/transactions/routing/journal.entry.routes'),
            },

            {
                path: 'new-journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/transactions/routing/journal.new.entry.routes'),                                         
            },
            {
                path: 'list-journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/transactions/routing/journal.gl.entry.routes'),
            },
            {
                path: 'ar-journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/transactions/routing/journal.ar.entry.routes'),
            },
            {
                path: 'ap-journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/transactions/routing/journal.ap.entry.routes'),
            },
            {
                path: 'edit-journals',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/transactions/routing/journal.edit.entry.routes'),
            },
            {
                path: 'analytics',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/admin/finance/finance.routes'),
            },
            {
                path: 'projects',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/admin/dashboard/project.routes'),
            },
            {
                path: 'reporting',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/reporting/reporting.routes'),
            },

            {
                path: 'expense-reports',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/reporting/expense/expense.routes'),
            },
            {
                path: 'kanban',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/kanban/kanban/kanban.routes'),
            },
            {
                path: 'finance',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/finance/finance.routes'),
            },
            {
                path: 'chat',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/chat/chat.routes'),
            },
            {
                path: 'budget',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/budget/budget.entry.routes'),
            },

            // {
            //     path: 'blog',
            //     canActivate: [  isAuthenticatedGuard()],
                
                
                                
            // },
            // {
            //     path: 'documentation',
            //     canActivate: [  isAuthenticatedGuard()],
                
                                
            // },
            {
                path: 'glaccts',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/accounting/static/gl.main.components.routes'),
            
            },
            {
                path: 'settings',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () => import('app/features/pages/settings/settings.routes'),
            },
            {
                path: 'docs',
                canActivate: [isAuthenticatedGuard()],
                loadChildren: () =>
                    import('app/features/file-manager/file-manager.routes'),
            },
            // {
            //     path: '**', loadChildren: () =>
            //         import('app/modules/pages/error/error-404/error-404.routes')
            // },
        ],
    },
    { path: '**', pathMatch: 'full', redirectTo: 'auth' },
];
