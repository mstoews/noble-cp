import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/services/material.module';
import { Subject, takeUntil } from 'rxjs';
import { JournalEntryComponent } from './journal-entry.component';
import { JournalUpdateComponent } from './journal-update/journal-update.component';
import { FileManagerComponent } from 'app/modules/file-manager/file-manager.component';
import { BudgetWizardComponent } from './budget-wizard.component';


const imports = [
    MaterialModule, 
    NgFor, 
    NgClass, 
    NgSwitch, 
    NgSwitchCase, 
    JournalEntryComponent, 
    JournalUpdateComponent, 
    FileManagerComponent, 
    BudgetWizardComponent
]

@Component({
  selector: 'budget-main',
  standalone: true,
  imports        : [imports],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-main.component.html',
  styles: ``
})
export class BudgetMainComponent {

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
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Setup available panels
        this.panels = [
            {
                id         : 'listing',
                icon       : 'heroicons_outline:document-check',
                title      : 'Budget Maintenance',
                description: 'Manage your budget transactions',
            },
            {
                id         : 'entry',
                icon       : 'heroicons_outline:document-plus',
                title      : 'Add Budget Entry',
                description: 'Create budget entry for each of the current trial balance line entry items.',
            },
            {
                id         : 'template',
                icon       : 'heroicons_outline:document-duplicate',
                title      : 'Forecasts',
                description: 'Budget and actual amounts combined to create an estimated forecast for year-end results',
            } ,
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
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
    ngOnDestroy(): void
    {
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
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
