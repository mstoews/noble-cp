import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginFormComponent } from './ui/login-form.component';
import { LoginService } from './data-access/login.service';
import { AuthService } from 'app/shared/data-access/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login',
  template:
    `
    @if(authService.user() === null) {
     <div class="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0">
        <div class="md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-4 sm:p-12 md:p-16 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none sm:bg-card">
            <div class="w-full max-w-80 sm:w-80 mx-auto sm:mx-0">
            <div class="w-30 border-2 border-gray-700">
                <img src="assets/images/logo/logo.png" alt="logo">
            </div>
            <span>
                    <div class="mt-8 text-4xl font-extrabold tracking-tight leading-tight">Sign in</div>
            </span>

            <!-- <div class="flex items-baseline mt-0.5 font-medium">
                <div>Don't have an account?</div>
                <a
                    class="ml-1 text-primary-500 hover:underline"
                    [routerLink]="['/auth/register']">Sign up
                </a>
            </div> -->

            @if(authService.user() === null){
                <app-login-form  [loginStatus]="loginService.status()"  (login)="loginService.login$.next($event)" />
            } @else {
                <mat-spinner diameter="50" />
            }
            </div>
        </div>
        <div class="relative hidden md:flex flex-auto items-center justify-center w-1/2 h-full p-16 lg:px-28 overflow-hidden bg-gray-800 dark:border-l">
        <svg class="absolute inset-0 pointer-events-none"
             viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <g class="text-gray-700 opacity-25" fill="none" stroke="currentColor" stroke-width="100">
                <circle r="234" cx="196" cy="23"></circle>
                <circle r="234" cx="790" cy="491"></circle>
            </g>
        </svg>

        <svg class="absolute -top-16 -right-16 text-gray-700"
             viewBox="0 0 220 192" width="220" height="192" fill="none">
            <defs>
                <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
                </pattern>
            </defs>
            <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect>
        </svg>
        <div class="z-10 relative w-full max-w-2xl">
            <div class="text-7xl font-bold leading-none text-gray-100">
                <div>Welcome to</div>
                <div>Noble Ledger Accounting and Management Application</div>
            </div>
            <div class="mt-6 text-lg tracking-tight leading-6 text-gray-400">
                Noble Ledger is an accounting and property management application specifically developed for condominium management.
            </div>
            <div class="flex items-center mt-8">
                <div class="flex flex-0 items-center -space-x-1.5">
                    <img
                        class="flex-0 w-10 h-10 rounded-full ring-4 ring-offset-1 ring-gray-800 ring-offset-gray-800 object-cover"
                        src="assets/images/avatars/female-18.jpg" alt="female">
                    <img
                        class="flex-0 w-10 h-10 rounded-full ring-4 ring-offset-1 ring-gray-800 ring-offset-gray-800 object-cover"
                        src="assets/images/avatars/female-11.jpg" alt="female">
                    <img
                        class="flex-0 w-10 h-10 rounded-full ring-4 ring-offset-1 ring-gray-800 ring-offset-gray-800 object-cover"
                        src="assets/images/avatars/male-09.jpg" alt="female">
                    <img
                        class="flex-0 w-10 h-10 rounded-full ring-4 ring-offset-1 ring-gray-800 ring-offset-gray-800 object-cover"
                        src="assets/images/avatars/male-16.jpg" alt="female">
                </div>
                <div class="ml-4 font-medium tracking-tight text-gray-400">Join hundreds of companies world wide that benefit from our extra ordinary account and document management systems</div>
            </div>
        </div>
        </div>
        </div>
    }
  `,
  providers: [LoginService],
  imports: [RouterModule, LoginFormComponent, MatProgressSpinnerModule],
  styles: [
    `
      a {
        margin: 2rem;
        color: var(--accent-darker-color);
      }
    `,
  ],
})
export default class LoginComponent {
  public loginService = inject(LoginService);
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['projects']);
      }
    });
  }
}
