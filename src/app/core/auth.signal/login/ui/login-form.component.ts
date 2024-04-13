import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Credentials } from 'app/shared/interfaces/credentials';
import { LoginStatus } from '../data-access/login.service';

@Component({
    standalone: true,
    selector: 'app-login-form',
    template: `
        <form
            [formGroup]="loginForm"
            (ngSubmit)="login.emit(loginForm.getRawValue())"
            class="text-black dark:text-white w-full"  >
            <mat-form-field appearance="fill" class="w-full mt-2">
                <mat-label>Email</mat-label>
                <input
                    class="text-black dark:text-white w-full"
                    matNativeControl
                    formControlName="email"
                    type="email"
                    placeholder="email" />
             <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field id="password" appearance="fill" class="w-full text-black dark:text-white" #passwordField >
                <mat-label>Password</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput  matNativeControl [formControlName]="'password'" type="password" placeholder="password"/>
                <button mat-icon-button type="button" class="text-gray-300" (click)="passwordField.type === 'password' ? passwordField.type = 'text' : passwordField.type = 'password'" matSuffix>
                        @if (passwordField.type === 'password') {
                            <mat-icon [svgIcon]="'heroicons_solid:eye'"></mat-icon>
                        }
                        @if (passwordField.type === 'text') {
                            <mat-icon [svgIcon]="'heroicons_solid:eye-slash'"></mat-icon>
                        }
                </button>
                    <mat-error>
                        Password is required
                    </mat-error>
            </mat-form-field>

            @if (loginStatus === 'error'){
            <mat-error>Could not log you in with those login details.</mat-error>
            } @if(loginStatus === 'authenticating'){
                <mat-spinner color=primary diameter="50"></mat-spinner>
            }

            <button
                mat-raised-button
                color="accent"
                type="submit"
                [disabled]="loginStatus === 'authenticating'"
            >
                Login
            </button>
        </form>
    `,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    styles: [
        `
            form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            button {
                width: 100%;
            }

            mat-error {
                margin: 5px 0;
            }

            mat-spinner {
                margin: 1rem 0;
            }
        `,
    ],
})
export class LoginFormComponent {
    @Input({ required: true }) loginStatus!: LoginStatus;
    @Output() login = new EventEmitter<Credentials>();

    private fb = inject(FormBuilder);

    loginForm = this.fb.nonNullable.group({
        email: [''],
        password: [''],
    });
}
