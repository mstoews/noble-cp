import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChatService } from '../chat.service';
import { Chat, Profile } from '../chat.types';
import { NewChatComponent } from '../new-chat/new-chat.component';
import { ProfileComponent } from '../profile/profile.component';
import { Subject, takeUntil } from 'rxjs';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';


@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatSidenavModule, NewChatComponent, ProfileComponent, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, NgClass, RouterLink, RouterOutlet]
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: Profile;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    private _chatService = inject(ChatService);
    private _changeDetectorRef = inject(ChangeDetectorRef);

    

    async GenerateChat() {
        const ai = genkit({
            plugins: [googleAI()],
            model: gemini15Flash,
        });
        const response = await ai.generate(
            "Hi, how are you?"            
        );

        console.log(response.data);
    }

     async ngOnInit(): Promise<void> {
        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = this.filteredChats = chats;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        await this.GenerateChat();
         
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Reset the chat
        this._chatService.resetChat();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void {
        // Reset the filter
        if (!query) {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
