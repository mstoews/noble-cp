import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/shared/material.module';
import { Subject, takeUntil } from 'rxjs';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { ExpenseRptComponent } from './expense/expense-rpt.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { BalanceSheetStatementRptComponent } from './financial-statement/balance-sheet-statement-rpt.component';
import { IncomeStatementRptComponent } from './financial-statement/income-statement-rpt.component';
import { IncomeStatementComparisonRptComponent } from './financial-statement/income-statement-comparison.component';


const imports = [
    MaterialModule,

    NgClass,


    TrialBalanceComponent,


    BalanceSheetStatementRptComponent,
    IncomeStatementRptComponent,
    IncomeStatementComparisonRptComponent
]

@Component({
    selector: 'transaction-main',
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './reporting-panel.component.html',
    styles: ``
})
export class ReportingPanelComponent {

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'trial-balance';
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
                id: 'trial-balance',
                icon: 'heroicons_outline:document-check',
                title: 'Trial Balance Reporting',
                description: 'Distributed trial balance listing including the associated journal entries',
            },
            // {
            //     id: 'expense-statement',
            //     icon: 'heroicons_outline:document-plus',
            //     title: 'Expense Statement',
            //     description: 'Current period expense statement and comparison',
            // },
            {
                id: 'balance-sheet-statement',
                icon: 'heroicons_outline:document-duplicate',
                title: 'Balance Sheet Financial Statement',
                description: 'Balance sheet by period reporting',
            },
            {
                id: 'income-statement',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Income Financial Statement',
                description: 'Income statement by period reporting',
            },
            {
                id: 'income-statement-comparison',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Income Financial Statement Comparison',
                description: 'Income statement comparison by period reporting',
            },
            {
                id: 'cash-flows-statement',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Cash Flow Statement',
                description: 'Inflows and outflow from cash balance by fund',
            },
            {
                id: 'operations-statement',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Operations Statement',
                description: 'Expenses and inflows for operating transactions',
            },
            {
                id: 'ap-aging',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Accounts Payable Aging',
                description: 'Monthly aging of payments for accounts payable',
            },
            {
                id: 'ar-aging',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Accounts Receivable Aging',
                description: 'Monthly aging of receipts from sales or fees',
            },

            {
                id: 'reconciliations',
                icon: 'feather:image',
                title: 'Reconciliation Reporting',
                description: 'Bank, expense and financial reconciliation reporting',
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
