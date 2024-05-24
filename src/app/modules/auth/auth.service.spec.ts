import { provideHttpClientTesting } from '@angular/common/http/testing'
import { inject, TestBed } from '@angular/core/testing'

import { UiService } from '../common/ui.service'
import { AuthService } from './auth.servicea'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [AuthService, UiService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
  })

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy()
  }))
})
