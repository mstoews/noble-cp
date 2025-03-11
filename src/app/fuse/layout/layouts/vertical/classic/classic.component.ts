import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/fuse/core/navigation/navigation.service';
import { Navigation } from 'app/fuse/core/navigation/navigation.types';
import { SearchComponent } from 'app/fuse/layout/common/search/search.component';
import { UserComponent } from 'app/fuse/layout/common/user/user.component';
import { AppStore, ApplicationService, ProfileModel } from 'app/services/application.state.service';
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
                                    <span class="font-medium text-secondary">Noble Ledger v0.0.4.12</span>
                                </div>                                                            
                            </div>
                            <!-- User -->
                            
                        </ng-container>
                        <!-- Navigation footer hook -->
                        <!-- <ng-container fuseVerticalNavigationContentFooter>
                            <div class="flex items-center justify-center">
                                <img class="w-8" src="assets/images/logo/nobleledger.jpg" alt="logo">
                                Noble Ledger v0.0.4.12
                            </div>
                        </ng-container> -->
            </fuse-vertical-navigation>

            <!-- Wrapper -->
            <div class="flex flex-col flex-auto w-full min-w-0">

                <!-- Header -->
                <div
                    class="relative flex flex-0 items-center w-full h-16 px-4 md:px-6 z-49 shadow dark:shadow-none dark:border-b bg-card dark:bg-transparent print:hidden">
                    <!-- Navigation toggle button -->
                    <button mat-icon-button (click)="toggleNavigation('mainNavigation')">
                        <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                    </button>
                    <!-- Components -->

                    <div class="flex items-center pl-2 ml-auto space-x-0.5 sm:space-x-2">
                        <fuse-fullscreen class="hidden md:block"></fuse-fullscreen>
                        <search [appearance]="'bar'"></search>
                        <user></user>
                    </div>

                </div>

                <!-- Content -->
                <div class="flex flex-col flex-auto">
                    
                    @if (true) {
                    <router-outlet></router-outlet>
                    }
                </div>

                <!-- Footer -->
                <div
                    class="relative flex flex-0 items-center justify-start w-full h-14 px-4 md:px-6 z-49 border-t bg-card dark:bg-transparent print:hidden">
                    <span class="font-medium text-secondary">Noble Ledger v0.0.4.12 &copy; {{currentYear}}</span>
                </div>

            </div>

            <!-- Quick chat -->
            <!-- <quick-chat #quickChat="quickChat"></quick-chat> -->
    `,
    selector: 'classic-layout',
    providers: [],
    encapsulation: ViewEncapsulation.None,
    imports: [
        // FuseLoadingBarComponent, 
        FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, FuseFullscreenComponent, SearchComponent, UserComponent, RouterOutlet]
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // readonly store = inject(AppStore);
    readonly applicationService = inject(ApplicationService);

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
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
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
