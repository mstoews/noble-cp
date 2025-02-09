import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/services/material.module';
import { Subject, takeUntil } from 'rxjs';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { BalanceSheetStatementRptComponent } from './financial-statement/balance-sheet-statement-rpt.component';
import { IncomeStatementRptComponent } from './financial-statement/income-statement-rpt.component';
import { IncomeStatementComparisonRptComponent } from './financial-statement/income-statement-comparison.component';
import { DistributedTbComponent } from './distributed-tb/distributed-tb.component';
import { TbGridComponent } from './tb-grid/tb-grid.component';
import { AppStore, ApplicationService } from "../../services/application.state.service";
import { GridTemplateComponent } from './grid-template/grid-template.component';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


const mods = [
    MaterialModule,
    NgClass,
    TrialBalanceComponent,
    BalanceSheetStatementRptComponent,
    IncomeStatementRptComponent,
    IncomeStatementComparisonRptComponent,
    DistributedTbComponent,
    TbGridComponent,
    GridTemplateComponent
]

@Component({
    selector: 'transaction-main',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-hidden overflow-x-hidden">
    <mat-drawer-container class="flex-auto sm:h-full">
        <!-- Drawer -->
        @if(store.panels().length > 0) {
           <mat-drawer class="sm:w-72 dark:bg-gray-900" [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened"  #drawer>
                <!-- Header -->
                <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
                <!-- Title -->
                <div class="text-4xl font-extrabold tracking-tight leading-none">
                    Reporting
                </div>
                <!-- Close button -->
                <div class="md:hidden">
                    <button mat-icon-button (click)="drawer.close()">
                        <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                    </button>
                </div>
            </div>
            <!-- Panel links -->
            <div class="flex flex-col divide-y border-t border-b">
            @for (panel of panels; track trackByFn($index, panel)) {
                <div class="flex px-8 py-5 cursor-pointer" [ngClass]="{'hover:bg-gray-100 dark:hover:bg-hover': !selectedPanel || selectedPanel !== panel.id, 'bg-primary-50 dark:bg-hover':
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
                <div class="font-medium leading-6" [ngClass]="{ 'text-primary dark:text-primary-500': selectedPanel && selectedPanel === panel.id}">
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
        }
        
        <mat-drawer-content class="flex flex-col overflow-x-hidden">
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
                        @case ('tb-grid') { <tb-grid></tb-grid>  }
                        @case ('trial-balance') { <trial-balance></trial-balance>}
                        @case ('balance-sheet-statement') { <balance-sheet-statement-rpt></balance-sheet-statement-rpt> }
                        @case ('income-statement') { <income-statement-rpt></income-statement-rpt> }
                        @case ('income-statement-comparison') {  <income-statement-comparison-rpt></income-statement-comparison-rpt> }
                        @case ('distributed-tb') { <distributed-tb></distributed-tb>  }
                        @case ('grid-template') { <grid-template></grid-template> }
                    }

                    </div>
                </div>
            </mat-drawer-content>
        </mat-drawer-container>

    </div>
    `,
    styles: ``,
    imports: [mods],
    providers: [AppStore, ApplicationService],
    standalone: true
})
export class ReportingPanelComponent {

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'distributed-tb';
    PANEL_ID = 'reportingPanel';

    store = inject(AppStore);
    panelService = inject(ApplicationService);

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
        this.panelService.getUserId().subscribe((uid) => {
            this.panelService.findPanelByName(uid, this.PANEL_ID).subscribe((panel) => {
                this.selectedPanel = panel.lastPanelOpened;
            });
        });
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {


        this.panels = [
            {
                id: 'distributed-tb',
                icon: 'heroicons_outline:document-plus',
                title: 'Distributed Trial Balance',
                description: 'Tabular summary of trial balance by account',
            },

            
            {
                id: 'trial-balance',
                icon: 'heroicons_outline:document-check',
                title: 'Trial Balance Reporting',
                description: 'Distributed trial balance listing including the associated journal entries',
            },
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
            },
            {
                id: 'grid-template',
                icon: 'feather:image',
                title: 'Grid Template ',
                description: 'Example of using a html in grid',
            },
            {
                id: 'tb-grid',
                icon: 'heroicons_outline:document-check',
                title: 'TB Example Grid',
                description: 'Distributed trial balance listing including the associated journal entries',
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

        const panelState = {
            uid: '',
            panelName: this.PANEL_ID,
            lastPanelOpened: this.selectedPanel
        }

        this.panelService.getUserId()
            .subscribe((id) => {

                panelState.uid = id;
                this.panelService.setPanel(panelState);
            });

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
    // goToPanel(panel: string): void {        
    //     this.panelService.setLastPanel(panel);
    //     // Close the drawer on 'over' mode
    //     if (this.drawerMode === 'over') {
    //         this.drawer.close();
    //     }
    // }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

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


// <div class="mt-8">
//                     @switch (selectedPanel) {
//                         @case ('tb-grid') { <tb-grid></tb-grid>  }
//                         @case ('trial-balance') { <trial-balance></trial-balance>}
//                         @case ('balance-sheet-statement') { <balance-sheet-statement-rpt></balance-sheet-statement-rpt> }
//                         @case ('income-statement') { <income-statement-rpt></income-statement-rpt> }
//                         @case ('income-statement-comparison') {  <income-statement-comparison-rpt></income-statement-comparison-rpt> }                                        
//                         @case ('distributed-tb') { <distributed-tb></distributed-tb>  }
//                         @case ('grid-template') { <grid-template></grid-template> }                        
//                     }

//                     </div>