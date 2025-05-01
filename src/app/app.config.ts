import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideExperimentalCheckNoChangesForDebug, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideFuse } from '@fuse';
import { appRoutes } from 'app/app.routing';
import { provideIcons } from 'app/fuse/core/icons/icons.provider';
import { provideTransloco } from 'app/fuse/core/transloco/transloco.provider';
import { MockApiService } from 'app/fuse/mock-api';
import { environment } from 'environments/environment.prod';
import { InjectionToken } from '@angular/core';
import { authTokenInterceptor } from './auth.token.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideToastr } from 'ngx-toastr';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import * as fromPriority from 'app/state/kanban-state/priority/priority.state';
import * as fromKanban from 'app/state/kanban-state/kanban/kanban.state';
import * as fromPeriods from 'app/features/accounting/static/periods/periods.state';
import * as fromSubtype from 'app/features/accounting/static/subtype/sub-type.state';
import * as fromParty from 'app/features/accounting/static/party/party.state';
import * as fromAccounts from 'app/features/accounting/static/accts/Accts.state'
import * as fromGlType from 'app/features/accounting/static/gltype/gltype.state';
import * as fromProjects from 'app/state/kanban-state/projects/projects.state';


import {
  Firestore,
  initializeFirestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';

import {
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';

import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { loggingInterceptor } from "./logging-interceptor";
import { retryInterceptor } from "./retry-interceptor";


import { JournalReducer } from './state/journal/Journal.Reducer';
import { UsersReducer } from './state/users/Users.Reducer';

// Effects 

import { journalHeaderEffects } from './state/journal/Journal.Effects';


import { provideRouterStore } from '@ngrx/router-store';
import { FundsReducer } from './features/accounting/static/funds/Funds.Reducer';




import { periodEffects } from './features/accounting/static/periods/periods.effects';
import { subTypeEffects } from './features/accounting/static/subtype/sub-type.effects';


import { AppService } from "./store/main.panel.store";
import { kanbanEffects } from './state/kanban-state/kanban/kanban.effects';
import { partyEffects } from './features/accounting/static/party/party.effects';
import { accountEffects } from './features/accounting/static/accts/Accts.effects';
import { glTypeEffects } from './features/accounting/static/gltype/gltype.effects';
import { projectEffects } from './state/kanban-state/projects/projects.effects';
import { TemplateReducer } from 'app/state/template/Template.Reducer';
import { fundsEffects } from './features/accounting/static/funds/Funds.Effects';
import { templateEffects } from 'app/state/template/Template.Effects';


const app = initializeApp(environment.firebase);

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore: Firestore;
    if (environment.useEmulators) {
      firestore = initializeFirestore(app, {});
      connectFirestoreEmulator(firestore, 'localhost', 8180);
    } else {
      firestore = getFirestore();
    }
    return firestore;
  },
});


export const STORAGE = new InjectionToken('Firebase storage', {
  providedIn: 'root',
  factory: () => {
    const storage = getStorage();
    if (environment.useEmulators) {
      connectStorageEmulator(storage, 'localhost', 9299);
    }
    return storage;
  },
});


export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9199', {
        disableWarnings: true,
      });
    }
    return auth;
  },
});

const CoreProviders = [
  provideHttpClient(withInterceptors([authTokenInterceptor, retryInterceptor, loggingInterceptor])),
];


export const appConfig: ApplicationConfig = {
  providers: [
    AppService,
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
    provideAppInitializer(() => {
      console.log('App initialized');

    },),
    ...CoreProviders,
    provideRouter(appRoutes, withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),),
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    provideTransloco(),

    /// NGRX Store and Effects
    provideStore({
      tpl: TemplateReducer,
      jnl: JournalReducer,
      fnd: FundsReducer,
      usr: UsersReducer,
    }),

    provideState(fromPriority.priorityFeature),
    provideState(fromPeriods.periodsFeature),
    provideState(fromSubtype.subtypeFeature),
    provideState(fromParty.partyFeature),
    provideState(fromKanban.kanbanFeature),
    provideState(fromAccounts.accountsFeature),
    provideState(fromGlType.gltypeFeature),
    provideState(fromProjects.projectFeature),
    provideEffects([
      accountEffects,
      periodEffects,
      kanbanEffects,
      templateEffects,
      partyEffects,
      journalHeaderEffects,
      periodEffects,
      fundsEffects,
      subTypeEffects,
      glTypeEffects,
      projectEffects,

    ]),
    provideRouterStore(),
    provideStoreDevtools({ maxAge: 25 }),

    // Toastr
    provideToastr(),

    // Fuse
    provideIcons(),
    provideFuse({
      mockApi: {
        delay: 0,
        service: MockApiService,
      },
      fuse: {
        layout: 'dense',
        scheme: 'dark',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'theme-default',
        themes: [
          {
            id: 'theme-default',
            name: 'Default',
          },
          {
            id: 'theme-brand',
            name: 'Brand',
          },
          {
            id: 'theme-teal',
            name: 'Teal',
          },
          {
            id: 'theme-rose',
            name: 'Rose',
          },
          {
            id: 'theme-purple',
            name: 'Purple',
          },
          {
            id: 'theme-amber',
            name: 'Amber',
          },
        ],
      },
    }),

  ],
};


