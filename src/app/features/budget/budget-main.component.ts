import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/shared/material.module';
import { Subject, takeUntil } from 'rxjs';
import { BudgetWizardComponent } from './budget-wizard.component';
import { BudgetUpdateComponent } from './update/budget-update.component';
import { BudgetLandingComponent } from './budget-landing/budget-landing.component';
import { AppService } from 'app/store/main.panel.store';
import { ApplicationStore } from 'app/store/application.store';


const imports = [
    MaterialModule,
    NgClass,
    BudgetUpdateComponent,
    BudgetLandingComponent,
    BudgetWizardComponent
]

@Component({
    selector: 'budget-main',
    imports: [imports],
    providers: [AppService],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-hidden">
    <mat-drawer-container class="flex-auto sm:h-full">
        <!-- Drawer -->
        @if(store.panels().length > 0) {
        <mat-drawer class="sm:w-72 dark:bg-gray-900" [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened" #drawer>
            <!-- Header -->
            <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
                <!-- Title -->
                <div class="text-4xl font-extrabold tracking-tight leading-none">
                    Budgets
                </div>
                <!-- Close button -->
                <div class="lg:hidden">
                    <button mat-icon-button (click)="drawer().close()">
                        <mat-icon [svgIcon]="'heroicons_outline:academic-cap'"></mat-icon>
                    </button>
                </div>
            </div>
            <!-- Panel links -->
            <div class="flex flex-col divide-y border-t border-b">
                @for (panel of panels; track trackByFn($index, panel)) {

                <div class="flex px-8 py-5 cursor-pointer" [ngClass]="{ 'hover:bg-gray-100 dark:hover:bg-hover': !selectedPanel || selectedPanel !== panel.id,
                            'bg-primary-50 dark:bg-hover':
                                selectedPanel && selectedPanel === panel.id
                        }" (click)="goToPanel(panel.id)">
                    <mat-icon [ngClass]="{'text-hint': !selectedPanel || selectedPanel !== panel.id, 'text-primary dark:text-primary-500': selectedPanel && selectedPanel === panel.id
                            }" [svgIcon]="panel.icon"></mat-icon>
                    <div class="ml-3">
                        <div class="font-medium leading-6" [ngClass]="{ 'text-primary dark:text-primary-500': selectedPanel && selectedPanel === panel.id }">
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
        <!-- Drawer content -->
        <mat-drawer-content class="flex flex-col">
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
                    @case ('budget-landing') { <budget-landing></budget-landing> }
                    @case ('budget-update') { <budget-update></budget-update> }                                        
                    @case ('entry') { <entry-wizard></entry-wizard> }                    
                    @case ('budget-wizard') { <budget-wizard></budget-wizard> }                    
                 }

                </div>
            </div>
        </mat-drawer-content>
    </mat-drawer-container>
</div>
    `,
    styles: ``
})
export class BudgetMainComponent {
    drawer = viewChild<MatDrawer>('drawer');
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'budget-landing';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    PANEL_ID = 'budgetPanel';
    store = inject(ApplicationStore);
    panelService = inject(AppService);

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

    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'budget-landing',
                icon: 'heroicons_outline:document-check',
                title: 'Budget Dashboard',
                description: 'Budget dashboard and forecast metrics',
            },
            {
                id: 'budget-update',
                icon: 'heroicons_outline:document-check',
                title: 'Budget Maintenance',
                description: 'Manage your budget transactions',
            },
            {
                id: 'budget-wizard',
                icon: 'heroicons_outline:document-duplicate',
                title: 'Forecasts',
                description: 'Budget and actual amounts combined to create an estimated forecast for year-end results',
            },
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

        var user: string;
        const userId = this.panelService.getUserId()
            .subscribe((uid) => {
                user = uid;
                panelState.uid = user;
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
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer().close();
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
