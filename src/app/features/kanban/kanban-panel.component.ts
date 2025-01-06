import { CdkScrollable } from '@angular/cdk/scrolling';
import { HttpClient } from '@angular/common/http';

import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
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
import { TasksComponent } from './task/tasks.component';
import { KanbanTypesComponent } from './types/types.component';
import { StatusComponent } from './status/status.component';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { KanbanPriorityComponent } from './priority/priority.component';
import { ScheduleNobleComponent } from './schedule/schedule.component';
import { TeamsComponent } from '../accounting/static/accounts/gl.teams.component';

@Component({
    selector: 'gl-kanban-panel',
    templateUrl: './kanban-panel.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MaterialModule,
        NgClass,
        TasksComponent,
        KanbanTypesComponent,
        StatusComponent,
        KanbanListComponent,
        KanbanPriorityComponent,
        ScheduleNobleComponent,
        TeamsComponent,
        ScheduleNobleComponent
    ],
    providers: [HttpClient],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanPanelComponent {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'kanban';
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
                id: 'kanban',
                icon: 'heroicons_outline:table-cells',
                title: 'Kanban Task Management',
                description: 'Kanban drag and drop management of tasks',
            },
            // {
            //     id: 'priority',
            //     icon: 'heroicons_outline:queue-list',
            //     title: 'Priority',
            //     description: 'List of key prioritization levels for each tasks to accommodate effective sorting',
            // },
            // {
            //     id: 'status',
            //     icon: 'heroicons_outline:calculator',
            //     title: 'Status',
            //     description: 'Status of each tasks',
            // },
            {
                id: 'tasks',
                icon: 'heroicons_outline:document-check',
                title: 'Tasks',
                description: 'Comprehensive list of all tasks with history',
            },
            {
                id: 'team',
                icon: 'heroicons_outline:chart-bar-square',
                title: 'Team',
                description: 'List of team members to assign tasks',
            },
            // {
            //     id: 'type',
            //     icon: 'heroicons_outline:chart-bar',
            //     title: 'Kanban Action Types',
            //     description: 'Type of actions that can used to categorize the work being completed',
            // }
            // ,
            // {
            //     id: 'schedule',
            //     icon: 'heroicons_outline:calendar',
            //     title: 'Schedule',
            //     description: 'Schedule events and meeting for completion of tasks',
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
