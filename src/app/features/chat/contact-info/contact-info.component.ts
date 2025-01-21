import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from '../chat.types';

@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule,]
})
export class ContactInfoComponent {
    readonly chat = input<Chat>(undefined);
    readonly drawer = input<MatDrawer>(undefined);

    /**
     * Constructor
     */
    constructor() {
    }
}
