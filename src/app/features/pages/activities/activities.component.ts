import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { ActivitiesService } from './activities.service';
import { Activity } from './activities.types';

@Component({
    selector: 'activity',
    templateUrl: './activities.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule, RouterLink, AsyncPipe, TitleCasePipe, DatePipe],
})
export class ActivitiesComponent implements OnInit {
    activities$: Observable<Activity[]>;

    /**
     * Constructor
     */
    constructor(public _activityService: ActivitiesService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the activities
        this.activities$ = this._activityService.activities;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Returns whether the given dates are different days
     *
     * @param current
     * @param compare
     */
    isSameDay(current: string, compare: string): boolean {
        return DateTime.fromISO(current).hasSame(DateTime.fromISO(compare), 'day');
    }

    /**
     * Get the relative format of the given date
     *
     * @param date
     */
    getRelativeFormat(date: string): string {
        return DateTime.fromISO(date).toRelativeCalendar();
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
