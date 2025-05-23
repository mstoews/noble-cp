import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, inject,
    OnDestroy,
    OnInit,
    signal, viewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/shared/material.module';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerComponent } from 'app/features/file-manager/file-manager.component';
import { EntryWizardComponent } from './wizard-entry.component';
import { JournalTemplateComponent } from './journal-template.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AppService, MainPanelStore } from 'app/store/main.panel.store';
import { ActivatedRoute } from '@angular/router';
import { JournalTemplateUpdateComponent } from './journal-template-update.component';
import { GLTransactionGridComponent } from './transaction-grid.component';
import { SpreadsheetViewComponent } from '../grid-components/spreadsheet-view.component';
import { PeriodStore } from 'app/store/periods.store';

const imports = [
    MaterialModule,
    NgClass,
    FileManagerComponent,
    EntryWizardComponent,
    JournalTemplateComponent,
    CdkScrollable,
    JournalTemplateUpdateComponent,
    GLTransactionGridComponent,
    SpreadsheetViewComponent


]

@Component({
    selector: 'transaction-main',
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MainPanelStore],
    template: `
        <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-x-hidden">
            <mat-drawer-container class="flex-auto sm:h-full">                
                @if(store.panels().length > 0) {
                    <mat-drawer class="sm:w-72 dark:bg-gray-900" [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened" #drawer>
                        <!-- Header -->
                        <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
                            <!-- Title -->
                            <div class="text-4xl font-extrabold tracking-tight leading-none">
                                Journals
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
                               <div class="flex px-8 py-5 cursor-pointer" [ngClass]="{'hover:bg-gray-100 dark:hover:bg-hover':  !selectedPanel || selectedPanel !== panel.id,
                                    'bg-primary-50 dark:bg-hover':
                                        selectedPanel && selectedPanel === panel.id
                                    }" (click)="goToPanel(panel.id)">
                                        <mat-icon [ngClass]="{'text-hint':!selectedPanel || selectedPanel !== panel.id, 'text-primary dark:text-primary-500': selectedPanel && selectedPanel === panel.id
                                    }" [svgIcon]="panel.icon"></mat-icon>
                                        <div class="ml-3">
                                            <div class="font-medium leading-6" [ngClass]="{'text-primary dark:text-primary-500': selectedPanel && selectedPanel === panel.id }">
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
                <mat-drawer-content class="flex flex-col overflow-x-hidden" cdkScrollable>
                    <!-- Main -->
                    <div class="flex-auto px-6 pt-9 pb-12 md:p-8 md:pb-12 lg:p-12">
                        <!-- Panel header -->
                        <div class="flex items-center">
                            <!-- Drawer toggle -->
                            <button class="lx2:hidden -ml-2" mat-icon-button (click)="drawer().toggle()">
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
                                @case ('entry') { <entry-wizard></entry-wizard>}  
                                @case ('tp')    { <journal-template></journal-template>  } 
                                @case ('at')    { <app-file-manager></app-file-manager>}
                                @case ('tmp')   { <gl-journal-template></gl-journal-template>}
                                @case ('grid')  { <gl-grid-transactions></gl-grid-transactions> }            
                                @case ('xls')   { <spreadsheet-view></spreadsheet-view> }                                
                            }
                        </div>
                    </div>
                </mat-drawer-content>
            </mat-drawer-container>
        </div>
    `,
    styles: ``
})
export class TransactionMainComponent implements OnInit, OnDestroy {

    drawer = viewChild<MatDrawer>("drawer");
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    defaultPanel = "tmp";
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public lastPanelOpened = signal<string>("");
    public panelService = inject(AppService);
    public periodStore = inject(PeriodStore);
    selectedPanel: string = 'entry';
    public storedPanel: string;

    PANEL_ID = 'transactionsPanel';
    store = inject(MainPanelStore);
    private activatedRoute = inject(ActivatedRoute);


    accounts: any;
    journalTypes: any;
    templates: any;
    parties: any;
    subTypes: any;
    periods: any;
    user: any;
    roles: any;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
        this.panelService.findPanelByName(this.store.uid(), this.PANEL_ID).subscribe((panel) => {
            this.selectedPanel = panel.lastPanelOpened;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        if (this.selectedPanel === '' && this.storedPanel === null || this.selectedPanel === undefined) {
            this.selectedPanel = this.defaultPanel;
        }

        this.panels = [
            {
                id: 'entry',
                icon: 'heroicons_outline:document-plus',
                title: 'Transaction Wizard',
                description: 'Create transactions and append digital artifacts for each transaction',
            },
            // {
            //     id: 'gl',
            //     icon: 'heroicons_outline:document-check',
            //     title: 'Journals Listing',
            //     description: 'Manage your transactions and documentation',
            // },
            // {
            //     id: 'ar',
            //     icon: 'mat_outline:money',
            //     title: 'Receipts and Receivables',
            //     description: 'Record your receipts and manage your accounts receivable',
            // },
            // {
            //     id: 'ap',
            //     icon: 'mat_outline:shop',
            //     title: 'Payments',
            //     description: 'Pay your bills and manage your accounts payable',
            // },

            {
                id: 'tmp',
                icon: 'heroicons_outline:document-duplicate',
                title: 'Templates Management',
                description: 'Journal booking template management',
            },
            {
                id: 'at',
                icon: 'heroicons_outline:document-arrow-up',
                title: 'Artifact Management',
                description: 'Manage the documentation of transactions',
            },
            // {
            //     id: 'xls',
            //     icon: 'feather:image',
            //     title: 'Spreadsheet Viewer',
            //     description: 'View your transactions in a spreadsheet format',
            // },
            {
                id: 'artifact-mgmt',
                icon: 'heroicons_outline:document-magnifying-glass',
                title: 'Artifact by Transaction',
                description: 'List of transactions with assigned artifacts',
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



    goToPanel(panel: string): void {
        // this.panelService.setPanel(panel);
        this.selectedPanel = panel;
        if (this.drawerMode === 'over') {
            this.drawer().close();
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

    ngOnDestroy(): void {

        //localStorage.setItem("transactionsPanel", this.selectedPanel);

        const panelState = {
            uid: '',
            panelName: this.PANEL_ID,
            lastPanelOpened: this.selectedPanel
        }

        var user: string;
        const userId = this.panelService.getUserId()
            .subscribe((uid) => {
                user = uid;
                panelState.uid = user;
                this.panelService.setPanel(panelState);
            });



        var transactionPanel: any

        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
