import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ApplicationService, AppStore } from 'app/services/application.state.service';
import { ProfileModel } from 'app/services/application.state.service';
import { ToastrService } from 'ngx-toastr';




@Component({
    selector: 'settings-account',
    template: `
    <div class="w-full max-w-3xl">

    <!-- Form -->
    <form [formGroup]="accountForm">
    <!-- Section -->
            <div class="w-full">
                <div class="text-xl">Profile</div>
                <div class="text-secondary">Information given here is for display to colleagues on a limited basis. </div>
            </div>
            <div class="grid sm:grid-cols-4 gap-6 w-full mt-8">
                <!-- Name -->
                <div class="sm:col-span-4">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Name</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:user'" matPrefix></mat-icon>
                        <input formControlName="name" matInput>
                    </mat-form-field>
                </div>
                <!-- Username -->
                <div class="sm:col-span-4">
                    <mat-form-field class="fuse-mat-emphasized-affix w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Username</mat-label>
                        <div class="text-secondary" matPrefix>
                            nobleledger.com/
                        </div>
                        <input formControlName="userName" matInput>
                    </mat-form-field>
                </div>
                <!-- Title -->
                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Title</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:briefcase'" matPrefix></mat-icon>
                        <input formControlName="title" matInput>
                    </mat-form-field>
                </div>
                <!-- Company -->
                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Company</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:building-office-2'" matPrefix></mat-icon>
                        <input formControlName="company" matInput>
                    </mat-form-field>
                </div>
                <!-- About -->
                <div class="sm:col-span-4">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>About</mat-label>
                        <textarea matInput formControlName="about" cdkTextareaAutosize
                            [cdkAutosizeMinRows]="5"></textarea>
                    </mat-form-field>
                    <div class="mt-1 text-md text-hint">Brief description for your profile. Basic HTML and Emoji are
                        allowed.</div>
                </div>
            </div>

            <!-- Divider -->
            <div class="my-10 border-t"></div>

            <!-- Section -->
            <div class="w-full">
                <div class="text-xl">Personal Information</div>
                <div class="text-secondary">Communication details in case we want to connect with you. These will be kept
                    private.</div>
            </div>
            <div class="grid sm:grid-cols-4 gap-6 w-full mt-8">
                <!-- Email -->
                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Email</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:envelope'" matPrefix></mat-icon>
                        <input formControlName="email" matInput>
                    </mat-form-field>
                </div>
                <!-- Phone -->

                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Phone</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:phone'" matPrefix></mat-icon>
                        <input formControlName="phone" matInput>
                    </mat-form-field>
                </div>
                <!-- Country -->
                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Country</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:map-pin'" matPrefix></mat-icon>
                        <mat-select formControlName="country">
                            <mat-option [value]="'usa'">United States</mat-option>
                            <mat-option [value]="'canada'">Canada</mat-option>
                            <mat-option [value]="'mexico'">Mexico</mat-option>
                            <mat-option [value]="'france'">France</mat-option>
                            <mat-option [value]="'germany'">Germany</mat-option>
                            <mat-option [value]="'italy'">Italy</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
                <!-- Language -->
                <div class="sm:col-span-2">
                    <mat-form-field class="w-full" [subscriptSizing]="'dynamic'">
                        <mat-label>Language</mat-label>
                        <mat-icon class="icon-size-5" [svgIcon]="'heroicons_solid:globe-alt'" matPrefix></mat-icon>
                        <mat-select formControlName="language">
                            <mat-option [value]="'english'">English</mat-option>
                            <mat-option [value]="'french'">French</mat-option>
                            <mat-option [value]="'spanish'">Spanish</mat-option>
                            <mat-option [value]="'german'">German</mat-option>
                            <mat-option [value]="'italian'">Italian</mat-option>
                        </mat-select>
                    </mat-form-field>
                </div>
            </div>

            <!-- Divider -->
            <div class="mt-11 mb-10 border-t"></div>

            <!-- Actions -->
            <div class="flex items-center justify-end">                
                <button (click)="saveProfile()" class="ml-4" mat-flat-button type="button" [color]="'primary'">Save</button>
            </div>
    </form>    
    </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AppStore],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class SettingsAccountComponent implements OnInit
{
    public accountForm!: FormGroup | any;
    private fb = inject(FormBuilder);

    readonly store = inject(AppStore);
    readonly applicationService = inject(ApplicationService);
    readonly toast = inject(ToastrService);
    profile:  ProfileModel;

    /**
     * Constructor
     */
    constructor()
    {
        this.applicationService.getUserId().subscribe((uid) => {   
            this.applicationService.loadProfile(uid).subscribe((profile) => {
                this.profile = profile;
                this.patchProfileForm(profile);
            });
        });        

    }

    public saveProfile() {  

        let currentDate = new Date().toISOString().split('T')[0];
        
        const account = this.accountForm.getRawValue();

        const profile: ProfileModel = {
            uid: this.store.uid(),            
            company: account.company,
            name: account.name,
            userName: account.userName,
            about: account.about,
            role: 'user',
            title: account.title,
            phone: account.phone,
            photoURL: '',
            status: 'active',
            email: account.email,
            country: account.country,
            language: account.language,
            lastLogin: currentDate,
            created: currentDate,
            updated: currentDate
        }
        
        this.updateProfile(profile);  
        this.toast.success('Profile saved successfully');
    }

    updateProfile(profile: ProfileModel) {
        this.store.setProfile(profile);
    }

    createEmptyForm() {
        this.accountForm = this.fb.group({
            name    : ['', Validators.required],
            userName: ['', Validators.required],
            title   : ['', Validators.required],
            company : ['', Validators.required],
            about   : ['', Validators.required],
            email   : ['', Validators.email],
            phone   : ['', Validators.required],
            country : ['', Validators.required],
            language: ['', Validators.required]
        });
    }

    patchProfileForm(profile: ProfileModel) {
    if (profile !== undefined) {                                                   
            this.accountForm.patchValue(profile);
       }
    }   

    

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form           
        this.createEmptyForm();
        
    }
}
