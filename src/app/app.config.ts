
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideAppInitializer } from '@angular/core';
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
  provideHttpClient(withInterceptors([authTokenInterceptor])),
  provideAppInitializer((() => () => {})()),
];


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    ...CoreProviders,
    provideRouter(appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    // Material Date Adapter
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

    // Transloco Config
    provideTransloco(),
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

