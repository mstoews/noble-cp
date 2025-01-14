import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideFuse } from '@fuse';
import { appRoutes } from 'app/app.routing';
import { provideIcons } from 'app/core/icons/icons.provider';
import { provideTransloco } from 'app/core/transloco/transloco.provider';
import { mockApiServices } from 'app/mock-api';
import { environment } from 'environments/environment.prod';
import { InjectionToken } from '@angular/core';
import { authTokenInterceptor } from './auth.token.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideToastr } from 'ngx-toastr';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import * as fromPriority from 'app/state/kanban-state/priority/priority.state';
import * as fromKanban from 'app/state/kanban-state/kanban/kanban.reducer';
import * as fromPeriods from 'app/state/periods/periods.state';
import * as fromSubtype from 'app/state/subtype/sub-type.state';
import * as fromParty from 'app/state/party/party.state';
import * as subtypeEffects from 'app/state/subtype/sub-type.effects';

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
import { TemplateReducer } from './state/template/Template.Reducer';

import { AccountsReducer } from './state/accounts/Accounts.Reducer';
import { JournalReducer } from './state/journal/Journal.Reducer';
import { UsersReducer } from './state/users/Users.Reducer';
// Effects 

import { journalHeaderEffects } from './state/journal/Journal.Effects';
import { templateEffects } from './state/template/Template.Effects';
import { userEffects } from './state/users/Users.Effects';
import { provideRouterStore } from '@ngrx/router-store';
import { KanbanEffects } from './state/kanban-state/kanban/kanban.effects';
import { FundsReducer } from './state/funds/Funds.Reducer';
import { fundsEffects } from './state/funds/Funds.Effects';
import { UserService } from './services/user.service';
import { accountEffects } from './state/accounts/Accounts.Effects';
import { periodEffects } from './state/periods/periods.effects';
import {PanelStateService} from "./services/panel.state.service";


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
  provideHttpClient(withInterceptors([authTokenInterceptor, loggingInterceptor, retryInterceptor])),
];


export const appConfig: ApplicationConfig = {
  providers: [
    PanelStateService,
    provideAnimations(),
    provideAppInitializer(() => {
      console.log('App initialized');

    },),
    ...CoreProviders,
    provideRouter(appRoutes, withPreloading(PreloadAllModules), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), ),
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'D',
        },
        display: {
          dateInput: 'DDD',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'DD',
          monthYearA11yLabel: 'LLLL yyyy',
        },
      },
    },
    provideTransloco(),

    /// NGRX Store and Effects
    provideStore({
      'tpl': TemplateReducer,
      'accounts': AccountsReducer,
      'journals': JournalReducer,
      'fnd': FundsReducer      
    }),
    provideState(fromKanban.kanbanFeature),
    provideState(fromPriority.priorityFeature),
    provideState(fromPeriods.periodsFeature),
    provideState(fromSubtype.subtypeFeature),
    provideState(fromParty.partyFeature),
    provideEffects(
      [ accountEffects, 
        
        templateEffects, 
        journalHeaderEffects, 
        KanbanEffects, 
        periodEffects, 
        fundsEffects, 
        subtypeEffects 
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
        services: mockApiServices,
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


