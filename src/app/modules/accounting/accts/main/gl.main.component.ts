
import { BalanceSheetComponent } from '../../../reporting/balance-sheet/balance-sheet.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FundsComponent } from '../funds/funds.component';
import { GlAccountsComponent } from '../accounts/gl-accts.component';
import { GlTypeComponent } from '../types/types.component';
import { HttpClient } from '@angular/common/http';
import { TrialBalanceComponent } from '../../../reporting/trial-balance/trial-balance.component';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';

import { MaterialModule } from 'app/services/material.module';
import { GlSubTypeComponent } from '../subtype/subtype.component';
import { PeriodsComponent } from '../periods/periods.component';
import { RolesComponent } from '../roles/roles.component';
import { TeamsComponent } from '../teams/teams.component';
import { RouterLink } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'gl-main',
    templateUrl: './gl.main.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        CdkScrollable,
        BalanceSheetComponent,
        TrialBalanceComponent,
        FundsComponent,
        GlAccountsComponent,
        GlTypeComponent,
        PeriodsComponent,
        GlSubTypeComponent,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        RolesComponent,
        TeamsComponent,
    ],
    providers: [HttpClient],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
                title: 'Account Types',
                description: 'Type of general ledger accounts by classification',
            },
            // {
            //     id: 'subtypes',
            //     icon: 'heroicons_outline:clipboard-document',
            //     title: 'Transaction Subtypes',
            //     description: 'Sub type definitions for transaction reporting',
            // },
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
            // {
            //     id: 'roles',
            //     icon: 'heroicons_outline:user-circle',
            //     title: 'Role Definitions',
            //     description: 'List of  assignable roles for team members',
            // }
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
