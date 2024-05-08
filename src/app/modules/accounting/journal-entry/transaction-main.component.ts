import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/services/material.module';
import { Subject, takeUntil } from 'rxjs';
import { JournalEntryComponent } from './journal-entry.component';
import { JournalUpdateComponent } from './journal-update/journal-update.component';


@Component({
  selector: 'transaction-main',
  standalone: true,
  imports        : [MaterialModule, NgFor, NgClass, NgSwitch, NgSwitchCase, JournalEntryComponent, JournalUpdateComponent],
  encapsulation  : ViewEncapsulation.None,
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
                icon       : 'heroicons_outline:banknotes',
                title      : 'Transaction Listing',
                description: 'Manage your transactions and documentation',
            },
            {
                id         : 'entry',
                icon       : 'heroicons_outline:currency-dollar',
                title      : 'Transaction Add/Amend',
                description: 'Create transactions and add evidence for each transaction on a granual basis.',
            },
            {
                id         : 'template',
                icon       : 'heroicons_outline:calculator',
                title      : 'Templates',
                description: 'Manage your accounting patterns to automate, reduce effort and provide consistency in accounting.',
            } ,
            {
                id         : 'evidence',
                icon       : 'heroicons_outline:building-office',
                title      : 'Artifact Management',
                description: 'Manage the documentation of transactions.',
            }                       
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
