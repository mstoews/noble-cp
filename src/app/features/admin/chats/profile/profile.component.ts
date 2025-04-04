import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatService } from '../chat.service';
import { Profile } from '../chat.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'chat-profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule]
})
export class ProfileComponent implements OnInit, OnDestroy {
    readonly drawer = input<MatDrawer>(undefined);
    profile: Profile;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _chatService: ChatService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;
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
}
