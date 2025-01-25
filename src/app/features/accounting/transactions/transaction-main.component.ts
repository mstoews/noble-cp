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
import { MaterialModule } from 'app/services/material.module';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerComponent } from 'app/features/file-manager/file-manager.component';
import { EntryWizardComponent } from './wizard/wizard-entry.component';
import { JournalTemplateComponent } from './journal-template.component';
import { ARTransactionComponent } from './ar-listing.component';
import { APTransactionComponent } from './ap-listing.component';
import { PanelService } from "../../../services/panel.state.service";
import { GLTransactionListComponent } from './gl-listing.component';


const imports = [
    MaterialModule,
    NgClass,
    FileManagerComponent,
    EntryWizardComponent,
    JournalTemplateComponent,
    ARTransactionComponent,
    APTransactionComponent,
    GLTransactionListComponent
]

@Component({
    selector: 'transaction-main',
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
                            Transactions
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
                                @case ('entry') { <entry-wizard></entry-wizard>  }
                                @case ('listing') {  <gl-transactions-list></gl-transactions-list>  }
                                @case ('ap')    { <ap-transactions></ap-transactions>}
                                @case ('ar')    { <ar-transactions></ar-transactions>}
                                @case ('template') { <journal-template></journal-template>  }
                                @case ('artifact') { <app-file-manager></app-file-manager>}
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
    defaultPanel = "listing";
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public lastPanelOpened = signal<string>("");
    public panelService = inject(PanelService);
    public selectedPanel: string;
    public storedPanel: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
       // this.selectedPanel = this.panelService.lastPanelOpened();
        if (this.selectedPanel === '') {
            this.selectedPanel = localStorage.getItem("transactionsPanel");
        }
        if (this.selectedPanel === null) {
            this.selectedPanel = this.defaultPanel;
        }


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels


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
            {
                id: 'listing',
                icon: 'heroicons_outline:document-check',
                title: 'Transactions Listing',
                description: 'Manage your transactions and documentation',
            },
            {
                id: 'ar',
                icon: 'mat_outline:money',
                title: 'Receipts and Receivables',
                description: 'Record your receipts and manage your accounts receivable',
            },
            {
                id: 'ap',
                icon: 'mat_outline:shop',
                title: 'Payments',
                description: 'Pay your bills and manage your accounts payable',
            },
            {
                id: 'template',
                icon: 'heroicons_outline:document-duplicate',
                title: 'Templates',
                description: 'Manage your accounting patterns to automate, reduce effort and provide consistency in accounting',
            },
            {
                id: 'artifact',
                icon: 'heroicons_outline:document-arrow-up',
                title: 'Artifact Management',
                description: 'Manage the documentation of transactions',
            },
            {
                id: 'tree',
                icon: 'feather:image',
                title: 'Tree Control Testing',
                description: 'Test the tree control and drop down lists',
            },
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
        this.panelService.setLastPanel(panel);
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

        const panelState = {
            id: this.selectedPanel,
            panelName: 'transactionsPanel',
            lastPanelOpened: this.selectedPanel
        }


        localStorage.setItem("transactionsPanel", this.selectedPanel);


        var user: string;
        const userId = this.panelService.getUserId()
            .subscribe((uid) => {
                user = uid;
                // this.panelService.addPanel(user, panelState);
            });

        var transactionPanel: any

        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
