import { Component, ViewChild, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginFormComponent } from './ui/login-form.component';
import { LoginService } from './data-access/login.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollService } from 'app/services/scroll.service';
import { MaterialModule } from 'app/services/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { NgClass, NgIf } from '@angular/common';
import { FuseCardComponent } from '@fuse/components/card';
import { AuthService } from 'app/modules/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [LoginService],
    imports: [RouterModule, LoginFormComponent, MatProgressSpinnerModule, MaterialModule, NgClass, FuseCardComponent, NgIf],
})
export default class LoginComponent {
    public loginService = inject(LoginService);
    public authService = inject(AuthService);
    private router = inject(Router);

    show: boolean = false;
    scrollService = inject(ScrollService);
    @ViewChild('drawer') drawer: MatDrawer;
    drawOpen: 'open' | 'close' = 'open';

    yearlyBilling: boolean = true;


    constructor() {
        effect(() => {
            if (this.authService.user()) {
                this.authService.refreshToken();
                this.router.navigate(['projects']);
            }
        });
    }
    login() {
        this.router.navigate(['projects']);
    }

    toggleDrawer() {
        const opened = this.drawer.opened;
        if (opened !== true) {
          this.drawer.toggle();
        } else {
          if (this.drawOpen === 'close') {
            this.drawer.toggle();
          }
        }
      }
    
    showMenu() {
        this.show = !this.show;
    }

    onScrollTo(id: string) {
        this.scrollService.scrollToElementById(id);
    }

    onService() {
        this.router.navigate(['service']);
    }
    onLearnMore() {
        this.router.navigate(['learn-more']);
    }
}
