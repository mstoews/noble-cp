import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/services/material.module';
import { Subject, takeUntil } from 'rxjs';
import { JournalEntryComponent } from './transactions/journal-listing.component';
import { JournalUpdateComponent } from './transactions/journal-update.component';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';
import { EntryWizardComponent } from './wizard/wizard-entry.component';
import { JournalTemplateComponent } from './journal-template.component';
import { TreeComponent } from '../tree/tree.component';
import { InventoryComponent } from 'app/modules/shop/shop-inventory-maintenance/inventory-grid.component';


const imports = [
    MaterialModule,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    JournalEntryComponent,
    JournalUpdateComponent,
    FileManagerComponent,
    EntryWizardComponent,
    JournalTemplateComponent,
    TreeComponent,
    InventoryComponent
]

@Component({
    selector: 'transaction-main',
    standalone: true,
    imports: [imports],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './transaction-main.component.html',
    styles: ``
})
export class TransactionMainComponent {

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'listing';
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
                id: 'listing',
                icon: 'heroicons_outline:document-check',
                title: 'Transaction Maintenance',
                description: 'Manage your transactions and documentation',
            },
            {
                id: 'entry',
                icon: 'heroicons_outline:document-plus',
                title: 'Transaction Wizard',
                description: 'Create transactions and append digital artifacts for each transaction',
            },
            {
                id: 'template',
                icon: 'heroicons_outline:document-duplicate',
                title: 'Templates',
                description: 'Manage your accounting patterns to automate, reduce effort and provide consistency in accounting',
            },
            {
                id: 'artifact',
                icon: 'feather:image',
                title: 'Artifact Management',
                description: 'Manage the documentation of transactions',
            },
            // {
            //     id: 'tree',
            //     icon: 'feather:image',
            //     title: 'Tree Control Testing',
            //     description: 'Test the tree control and drop down lists',
            // },
            {
                id: 'artifact-mgmt',
                icon: 'feather:image',
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