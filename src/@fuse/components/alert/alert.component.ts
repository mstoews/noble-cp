import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { FuseAlertAppearance, FuseAlertType } from '@fuse/components/alert/alert.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'fuse-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    exportAs: 'fuseAlert',
    imports: [MatIconModule, MatButtonModule]
})
export class FuseAlertComponent implements OnChanges, OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    readonly appearance = input<FuseAlertAppearance>('soft');
    readonly dismissed = input<boolean>(false);
    readonly dismissible = input<boolean>(false);
    readonly name = input<string>(this._fuseUtilsService.randomId());
    readonly showIcon = input<boolean>(true);
    readonly type = input<FuseAlertType>('primary');
    @Output() readonly dismissedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseAlertService: FuseAlertService,
        private _fuseUtilsService: FuseUtilsService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'fuse-alert-appearance-border': this.appearance() === 'border',
            'fuse-alert-appearance-fill': this.appearance() === 'fill',
            'fuse-alert-appearance-outline': this.appearance() === 'outline',
            'fuse-alert-appearance-soft': this.appearance() === 'soft',
            'fuse-alert-dismissed': this.dismissed(),
            'fuse-alert-dismissible': this.dismissible(),
            'fuse-alert-show-icon': this.showIcon(),
            'fuse-alert-type-primary': this.type() === 'primary',
            'fuse-alert-type-accent': this.type() === 'accent',
            'fuse-alert-type-warn': this.type() === 'warn',
            'fuse-alert-type-basic': this.type() === 'basic',
            'fuse-alert-type-info': this.type() === 'info',
            'fuse-alert-type-success': this.type() === 'success',
            'fuse-alert-type-warning': this.type() === 'warning',
            'fuse-alert-type-error': this.type() === 'error',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    public disMissed!: boolean

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
    
    }
        // Dismissed


    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the dismiss calls
        this._fuseAlertService.onDismiss
            .pipe(
                filter(name => this.name() === name),
                takeUntil(this._unsubscribeAll),
            )
            .subscribe(() => {
                // Dismiss the alert
                this.dismiss();
            });

        // Subscribe to the show calls
        this._fuseAlertService.onShow
            .pipe(
                filter(name => this.name() === name),
                takeUntil(this._unsubscribeAll),
            )
            .subscribe(() => {
                // Show the alert
                this.show();
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
     * Dismiss the alert
     */
    dismiss(): void {
        // Return if the alert is already dismissed
        if (this.dismissed()) {
            return;
        }

        // Dismiss the alert
        this._toggleDismiss(true);
    }

    /**
     * Show the dismissed alert
     */
    show(): void {
        // Return if the alert is already showing
        if (!this.dismissed()) {
            return;
        }

        // Show the alert
        this._toggleDismiss(false);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss/show the alert
     *
     * @param dismissed
     * @private
     */
    private _toggleDismiss(dismissed: boolean): void {
        // Return if the alert is not dismissible
        if (!this.dismissible()) {
            return;
        }

        // Set the dismissed
        //this.dismissed = dismissed;

        // Execute the observable
        this.dismissedChanged.next(this.dismissed());

        // Notify the change detector
        this._changeDetectorRef.markForCheck();
    }
}
