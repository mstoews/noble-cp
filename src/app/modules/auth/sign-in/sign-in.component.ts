import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, effect, inject } from '@angular/core';

import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

import { LoginService } from 'app/core/auth/login.service';
import { AuthService } from '../auth.service';

var components = [
    RouterLink,
    NgIf,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule
];

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [...components],
    providers: [AuthService, LoginService],

})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    public  _activatedRoute = inject(ActivatedRoute);
    public  _loginService = inject(LoginService);
    public  _authService = inject(AuthService);
    private _router = inject(Router);
    private _formBuilder = inject(FormBuilder);
    

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor() {
        effect(() => {
            if (this._authService.user()) {            
              this._router.navigate(['home']);
            }
          });
    }

    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
    }

    async signIn(): Promise<void> {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        const credentials = {
            email: this.signInForm.value.email,
            password: this.signInForm.value.password,
        };

        this._authService.login(credentials).subscribe( (Credentials) =>
        {
            console.debug(Credentials);
            // Navigate to the redirect url
            // this._router.navigateByUrl(this._activatedRoute.snapshot.queryParams.redirectUrl || 'home');
        });
    }

}
