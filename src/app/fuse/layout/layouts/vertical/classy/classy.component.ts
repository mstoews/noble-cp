import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Common } from '@syncfusion/ej2-angular-pivotview';
import { NavigationService } from 'app/fuse/core/navigation/navigation.service';
import { Navigation } from 'app/fuse/core/navigation/navigation.types';
import { UserService } from 'app/fuse/core/user/user.service';
import { SearchComponent } from 'app/fuse/layout/common/search/search.component';
import { UserComponent } from 'app/fuse/layout/common/user/user.component';
import { ApplicationStore } from 'app/store/application.store';
import { AppService } from 'app/store/main.panel.store';
import { Subject, takeUntil } from 'rxjs';

@Component({

    template: `
    <!-- Loading bar -->
        <!-- <fuse-loading-bar></fuse-loading-bar> -->

        <!-- Navigation -->
        <fuse-vertical-navigation
            class="dark bg-gray-900 print:hidden"
            [mode]="isScreenSmall ? 'over' : 'side'"
            [name]="'mainNavigation'"
            [navigation]="navigation.default"
            [opened]="!isScreenSmall">
            <!-- Navigation header hook -->
            
            <ng-container fuseVerticalNavigationContentHeader>
                <div class="flex w-full items-center p-4 pl-6">
                    <!-- Logo -->
                    <div class="flex items-center justify-center">
                        <img class="w-8" src="assets/images/logo/nobleledger.jpg" alt="logo"> 
                        <span>Noble Ledger v0.0.4.26</span>  
                    </div>
                    <!-- Components -->
                    <div class="ml-auto flex items-center">
                        <!-- <notifications></notifications> -->
                        <user [showAvatar]="false"></user>
                    </div>
                </div>
                <!-- User -->
                <div class="flex w-full flex-col items-center p-4">
                    <div class="relative h-30 w-24">                        
                        @if ( profile| async; as profile) {
                            @if( profile.photoURL !== null && profile.photoURL !== undefined && profile.photoURL !== '') 
                                {
                                    <img class="w-full h-full rounded-full"
                                        [src]="profile.photoURL"
                                        alt="user photo"/>
                                }
                                @else {  
                                                    
                                    <mat-icon
                                        class="icon-size-24"
                                        [svgIcon]="'heroicons_solid:user-circle'">
                                    </mat-icon>
                                }                
                                        
                                <div class="mt-6 flex w-full flex-col items-center justify-center">
                                    <div  class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium leading-normal"  >
                                        {{ profile.name}}
                                    </div>
                                    <!-- <div  class="text-secondary mt-0.5 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-md font-medium leading-normal">
                                        {{profile.email}}  
                                    </div> -->
                                </div>
                            }
                    </div>                    
                </div>
            </ng-container>
            <!-- Navigation footer hook -->
            <ng-container fuseVerticalNavigationContentFooter>
                <div class="flex items-center justify-left">                    
                    
                </div>
            </ng-container>
        </fuse-vertical-navigation>

        <!-- Wrapper -->
        <div class="flex w-full min-w-0 flex-auto flex-col">
            <!-- Header -->
            <div
                class="bg-card relative z-49 flex h-16 w-full flex-0 items-center px-4 shadow dark:border-b dark:bg-transparent dark:shadow-none md:px-6 print:hidden"
            >
                <!-- Navigation toggle button -->
                <button mat-icon-button (click)="toggleNavigation('mainNavigation')">
                    <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                </button>
                <!-- Components -->
                <div class="ml-auto flex items-center space-x-0.5 pl-2 sm:space-x-2">
                    <!-- <languages></languages> -->
                    <fuse-fullscreen class="hidden md:block"></fuse-fullscreen>
                    <search [appearance]="'bar'"></search>
                    <!-- <shortcuts></shortcuts> -->
                    <!-- <messages></messages> -->
                    <button
                        class="lg:hidden"
                        mat-icon-button
                        
                    >
                        <mat-icon
                            [svgIcon]="'heroicons_outline:chat-bubble-left-right'"
                        ></mat-icon>
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="flex flex-auto flex-col">
                <!-- *ngIf="true" hack is required here for router-outlet to work correctly.
                    Otherwise, layout changes won't be registered and the view won't be updated! -->
                @if (true) {
                    <router-outlet></router-outlet>
                }
            </div>

            <!-- Footer -->
            <!--<div class="relative flex flex-0 items-center justify-start w-full h-14 px-4 md:px-6 z-49 border-t bg-card dark:bg-transparent print:hidden">
                <span class="font-medium text-secondary">Fuse &copy; {{currentYear}}</span>
            </div>-->
        </div>

<!-- Quick chat -->
<!-- <quick-chat #quickChat="quickChat"></quick-chat> -->

    `,
    encapsulation: ViewEncapsulation.None,
    selector: 'classy-layout',
    providers: [],
    imports: [
        // FuseLoadingBarComponent,
        CommonModule,
        FuseVerticalNavigationComponent,
        UserComponent,
        MatIconModule,
        MatButtonModule,
        FuseFullscreenComponent,
        SearchComponent,
        RouterOutlet
    ],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    readonly service = inject(AppService);
    profile = this.service.getProfile();

    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {



    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });


        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
