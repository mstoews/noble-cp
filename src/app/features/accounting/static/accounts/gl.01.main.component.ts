
import { BalanceSheetComponent } from '../../../reporting/balance-sheet/balance-sheet.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { GlAccountsComponent } from './gl.accts.component';
import { GlTypeComponent } from './gl.types.component';
import { HttpClient } from '@angular/common/http';
import { TrialBalanceComponent } from '../../../reporting/trial-balance/trial-balance.component';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

import { MaterialModule } from 'app/services/material.module';
import { GlSubTypeComponent } from './gl.subtype.component';
import { PeriodsComponent } from './gl.periods.component';
import { RolesComponent } from './gl.roles.component';
import { TeamsComponent } from './gl.teams.component';
import { RouterLink } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FundsComponent } from './gl.funds.component';
import { GLGridComponent } from '../../grid-components/gl-grid.component';

@Component({
    template: `
    <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-hidden">
    <mat-drawer-container class="flex-auto sm:h-full">
        <!-- Drawer -->
        <mat-drawer class="sm:w-72 dark:bg-gray-900" [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened"
            #drawer>
            <!-- Header -->
            <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
                <!-- Title -->
                <div class="text-4xl font-extrabold tracking-tight leading-none">
                    Reference Data
                </div>
                <!-- Close button -->
                <div class="lg:hidden">
                    <button mat-icon-button (click)="drawer.close()">
                        <mat-icon [svgIcon]="'heroicons_outline:academic-cap'"></mat-icon>
                    </button>
                </div>
            </div>
            <!-- Panel links -->
            <div class="flex flex-col divide-y border-t border-b">
                @for (panel of panels; track trackByFn($index, panel)) {

                <div class="flex px-8 py-5 cursor-pointer" [ngClass]="{
                            'hover:bg-gray-100 dark:hover:bg-hover':
                                !selectedPanel || selectedPanel !== panel.id,
                            'bg-primary-50 dark:bg-hover':
                                selectedPanel && selectedPanel === panel.id
                        }" (click)="goToPanel(panel.id)">
                    <mat-icon [ngClass]="{
                                'text-hint':
                                    !selectedPanel ||
                                    selectedPanel !== panel.id,
                                'text-primary dark:text-primary-500':
                                    selectedPanel && selectedPanel === panel.id
                            }" [svgIcon]="panel.icon"></mat-icon>
                    <div class="ml-3">
                        <div class="font-medium leading-6" [ngClass]="{
                                    'text-primary dark:text-primary-500':
                                        selectedPanel &&
                                        selectedPanel === panel.id
                                }">
                            {{ panel.title }}
                        </div>
                        <div class="mt-0.5 text-secondary">
                            {{ panel.description }}
                        </div>
                    </div>
                </div>

                }
            </div>
        </mat-drawer>

        <!-- Drawer content -->
        <mat-drawer-content class="flex flex-col">
            <!-- Main -->
            <div class="flex-auto px-6 pt-9 pb-12 md:p-8 md:pb-12 lg:p-12">
                <!-- Panel header -->
                <div class="flex items-center">
                    <!-- Drawer toggle -->
                    <button class="lg:hidden -ml-2" mat-icon-button (click)="drawer.toggle()">
                        <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                    </button>

                    <!-- Panel title -->
                    <div class="ml-2 lg:ml-0 text-3xl font-bold tracking-tight leading-none">
                        {{ getPanelInfo(selectedPanel).title }}
                    </div>
                </div>

                <!-- Load settings panel -->
                <div class="mt-8">

                    @switch (selectedPanel) {
                    @case ('accounts'){ <glaccounts></glaccounts> }
                    @case ('types') { <gl-types></gl-types> }
                    @case ('subtypes'){ <subtypes></subtypes> } 
                    @case ('funds') { <funds></funds> }
                    @case ('periods') { <periods></periods> }
                    @case ('team') { <team></team> }
                    @case ('roles') { <roles></roles> }
                    }

                </div>
            </div>
        </mat-drawer-content>
        </mat-drawer-container>
        </div>
    `,
    selector: 'gl-main',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MaterialModule,
        FundsComponent,
        GlAccountsComponent,
        GlTypeComponent,
        PeriodsComponent,
        RolesComponent,
        GlSubTypeComponent,
        NgClass,
        TeamsComponent,
    ],
    providers: [HttpClient],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlMainComponent {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'accounts';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'accounts',
                icon: 'heroicons_outline:currency-dollar',
                title: 'General Ledger Accounts',
                description: 'General ledger list of accounts in a hierarchy',
            },
            {
                id: 'types',
                icon: 'heroicons_outline:banknotes',
                title: 'Account Financial Statement Mapping',
                description: 'Type of general ledger accounts by classification for financial statements',
            },
            {
                id: 'subtypes',
                icon: 'heroicons_outline:banknotes',
                title: 'Transaction Mapping Types',
                description: 'Mapping individual transaction types for financial statements',
            },
            {
                id: 'funds',
                icon: 'heroicons_outline:clipboard',
                title: 'Reserve Funds',
                description: 'Reserve fund definitions for transactions',
            },
            {
                id: 'periods',
                icon: 'heroicons_outline:calendar',
                title: 'Accounting Periods',
                description: 'Start and end date of each accounting period',
            },
            {
                id: 'team',
                icon: 'heroicons_outline:user',
                title: 'Accounting Team',
                description: 'List of accounting team members',
            },
            {
                id: 'roles',
                icon: 'heroicons_outline:user-circle',
                title: 'Role Definitions',
                description: 'List of  assignable roles for team members',
            }
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
