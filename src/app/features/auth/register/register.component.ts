import { Component, effect, inject } from '@angular/core';
import { RegisterFormComponent } from './ui/register-form.component';
import { RegisterService } from './data-access/register.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/features/auth/auth.service';

@Component({
    selector: 'app-register',
    template: `
    <div class="container gradient-bg">
      <app-register-form
        [status]="registerService.status()"
        (register)="registerService.createUser$.next($event)"
      />
    </div>
  `,
    providers: [RegisterService],
    imports: [RegisterFormComponent]
})
export default class RegisterComponent {
  public registerService = inject(RegisterService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user() !== null) {
        this.router.navigate(['projects']);
      }
    });
  }
}
