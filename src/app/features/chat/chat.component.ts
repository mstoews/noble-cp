import { Component, ViewChild, OnInit,ViewEncapsulation } from '@angular/core';
import { ChatUIComponent, ChatUIModule, ToolbarSettingsModel, MessageSendEventArgs } from '@syncfusion/ej2-angular-interactive-chat';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons'
import { integrationMessagedata, integrationListTemplateData, botData, chatSuggestions, botMessagedata, walterMessagedata, lauraMessagedata, teamsMessagedate as teamsMessageDate, suyamaMessagedata } from './messageData';
import { CommonModule } from '@angular/common';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';




@Component({
  selector: 'control-content',
  template: `
  <section>
    <div id="chat-header" class="flex flex-col items-center max-w-4xl mx-auto pb-6 bg-white dark:bg-gray-900 rounded-xl overflow-hidden" style="max-height: 800px;">
        <div class="w-full p-2">
            <div class="flex items-center justify-between py-1 pl-2 sm:pl-4 pr-2">
                <div class="flex items-center">
                    <span class="flex items-center gap-3">
                        <div class="relative h-8">
                            <span class="e-avatar e-avatar-circle e-avatar-small" style="background-image: url(assets/images/common/avatar/avatar-3.jpg);" alt="profile picture"></span>
                            <div class="w-3 h-3 rounded-full bg-green-700 dark:bg-green-500 absolute border border-white dark:border-black" style="bottom: -2px; right: -2px;"></div>
                        </div>
                        <span class="text-base font-semibold text-gray-900 dark:text-white">Mark Davis</span>
                    </span>
                </div>
                <div class="flex items-center gap-3">
                    <button ejs-button class="e-icons e-search text-base leading-3 sm:block hidden" cssClass="e-flat" type="button" aria-label="search" role="button"></button>
                    <div class="border-l h-6 border-gray-200 dark:border-gray-600 sm:block hidden"></div>
                    <button ejs-button class="sf-icon-phone-01 text-base sm:block hidden leading-3" cssClass="e-flat" type="button" aria-label="audio call" role="button"></button>
                    <button ejs-button class="e-icons e-video sm:block hidden" cssClass="e-flat" type="button" aria-label="video call" role="button"></button>
                    <button ejs-button class="e-icons e-more-vertical-1" cssClass="e-flat" type="button" aria-label="more options" role="button"></button>
                </div>
            </div>
        </div>
        <div class="flex items-center flex-col pt-7 pb-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <span class="e-badge e-badge-pill e-badge-secondary border border-gray-200 e-small">Wednesday, Sep 18th</span>
            <ejs-listview class="!border-0 px-2 sm:px-4 sm:pr-7 lg:pr-12 py-4" [dataSource]="data" width="100%" height="100%" aria-label="chat conversations" role="list">
                <ng-template #template let-data>
                    <div *ngIf="data.chat != 'receiver'; then senderTemplate; else receiverTemplate"></div>
                    <ng-template #senderTemplate>
                        <div class="flex justify-end ml-auto sm:mr-3 gap-3 items-start w-4/5">
                            <div class="flex flex-col gap-1 items-end">
                                <div class="py-2 px-3 rounded-lg rounded-se-none bg-gray-100 dark:bg-gray-700">
                                    <div class="text-gray-900 dark:text-gray-50">{{data.text}}</div>
                                </div>
                                <div class="flex">
                                    <p class="text-xs text-gray-500">{{data.time}}</p>
                                    <div class="sf-icon-double-check-01 ml-0.5 sm:ml-1 leading-4 text-base text-primary-600 dark:text-primary-400" *ngIf="data.open"></div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                    <ng-template #receiverTemplate>
                        <div class="flex justify-start gap-3 items-start sm:w-4/5">
                            <div *ngIf="data.avatar != ''">
                                <span class="e-avatar e-avatar-circle e-avatar-small" [ngStyle]="{ 'background-image': 'url(assets/images/common/avatar/' + data.avatar + ')' }" alt="receiver avatar"></span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="py-2 px-3 rounded-lg rounded-ss-none bg-gray-50 dark:bg-gray-800">
                                    <div class="text-gray-900 dark:text-gray-50">{{data.text}}</div>
                                </div>
                                <p class="text-xs text-gray-500">{{data.name}} <span class="ms-1.5">{{data.time}}</span></p>
                            </div>
                        </div>
                    </ng-template>
                </ng-template>
            </ejs-listview>
        </div>
        <div class="e-bigger w-full text-base px-4 sm:pl-6 sm:pr-12 lg:pr-16 lg:mr-1">
            <ejs-textbox #textbox type="text" placeholder="Enter a message" (created)="textbox.addIcon('append', 'sf-icon-navigation-right-up border-0')" aria-label="enter a message" role="textbox"></ejs-textbox>
        </div>
    </div>
  </section>
  `,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ChatUIModule, ButtonModule, CommonModule, ListViewModule, TextBoxModule],
  styles: [`
    #chat-header .e-list-item {
          border: none;
          height: auto;
          padding: 8px;
      }

      #chat-header .e-listview .e-list-item.e-active,
      #chat-header .e-list-item:hover {
          background-color: transparent;
    }
    `]
,
})
export class ChatComponent implements OnInit {
  @ViewChild('chatUI') public chatUI: ChatUIComponent;
  @ViewChild('listView') public listView: ListViewComponent;

  
  public chatMessages = {
    user1: integrationMessagedata,
    admin: botMessagedata,
    user2: walterMessagedata,
    user3: lauraMessagedata,
    team: teamsMessageDate,
    user4: suyamaMessagedata,
  };

  
  
  public currentUser = { id: 'user1', user: 'Albert', avatarUrl: '../../../assets/images/avatars/chat.jpg' };
  public currentMessages = this.chatMessages.user1;
  public currentSuggestions = [];
  public headerText = 'Albert';
  public headerIconCss = 'chat_user1_avatar';



  public headerToolbar: ToolbarSettingsModel = {
    items: [ { iconCss: 'sf-icon-phone-call', align: 'Right', tooltip: 'Audio call' }]
  };

  
  async ngOnInit() {
    this.selectChatUser(0);
    
  }

  onChatItemSelected(args: SelectEventArgs): void {
    this.chatMessages[this.chatUI.user.id] = this.chatUI.messages;
    this.chatUI.suggestions = [];
    this.selectChatUser(args.index);
    if(args.index >= 0) this.toggleListView();
  }  
  onActionComplete(): void {
    this.listView.selectItem(integrationListTemplateData[0]);
    const chatBtn: HTMLElement = document.getElementById('chatbtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', this.toggleListView);
    }
  }
  private selectChatUser(index: number): void {
    if (!this.chatUI) {
      return;
    }
    const userSettings = [
      { headerText: 'Albert',         headerIconCss: 'chat_user1_avatar', user: { id: 'user1',  user: 'Albert',  avatarUrl: './assets/chat-ui/images/andrew.png' },  messages: this.chatMessages.user1 },
      { headerText: 'Decor bot',      headerIconCss: 'chat_bot_avatar',   user: { id: 'admin',  user: 'Admin',   avatarUrl: './assets/chat-ui/images/bot.png' },     messages: this.chatMessages.admin, suggestions: chatSuggestions },
      { headerText: 'Charlie',        headerIconCss: 'chat_user2_avatar', user: { id: 'user2',  user: 'Charlie', avatarUrl: './assets/chat-ui/images/charlie.png' }, messages: this.chatMessages.user2 },
      { headerText: 'Laura Callahan', headerIconCss: 'chat_user3_avatar', user: { id: 'user3',  user: 'Laura',   avatarUrl: './assets/chat-ui/images/laura.png' },   messages: this.chatMessages.user3 },
      { headerText: 'New Dev Team',   headerIconCss: 'chat_team_avatar',  user: { id: 'team',   user: 'Admin',   avatarUrl: './assets/chat-ui/images/calendar.png' },messages: this.chatMessages.team },
      { headerText: 'Reena',          headerIconCss: 'chat_user4_avatar', user: { id: 'user4',  user: 'Albert' },messages: this.chatMessages.user4 }
    ];

    const selectedUser = userSettings[index];
    Object.assign(this.chatUI, selectedUser);
    this.chatUI.dataBind();
  }
  private toggleListView(): void {
    const listPopup: HTMLElement = document.getElementById('toggle-chat-list');
    if (window.innerWidth < 1200) listPopup.style.display = listPopup.style.display === 'none' || listPopup.style.display === '' ? 'block' : 'none';
  }
  onMessageSend(args: MessageSendEventArgs): void {
    this.chatUI.suggestions = [];
    setTimeout(() => {
      if (args.message.author.id === 'admin') {
        const foundMessage = botData.find(m => m.text === args.message.text);
        const defaultResponse = 'Your message text: ' + args.message.text + '</br></br>' + 'For real-time message processing, connect the Chat UI control to your preferred AI service, such as OpenAI or Azure Cognitive Services.';
        const message = {
          author: { id: !foundMessage ? 'default' : 'bot', user: !foundMessage ? 'Default' : 'Bot', avatarUrl: !foundMessage ? '' : './assets/chat-ui/images/bot.png' },
          text: foundMessage?.reply || defaultResponse
        };
        this.chatUI.addMessage(message);
        this.chatUI.suggestions = foundMessage?.suggestions || [];
      }
    }, 500);
  }

  public data: Object[] = [
    {
        id: '1',
        name: 'John',
        time: '8:57 AM',
        avatar: '',
        text: 'Hi, I’m having trouble accessing the company VPN.',
        chat: 'sender',
        open: false
    },
    {
        id: '2',
        name: 'Mark Davis',
        time: '9:00 AM',
        avatar: 'avatar-3.jpg',
        text: 'Hello! I can help with that. Are you seeing any error messages?',
        chat: 'receiver'
    },
    {
        id: '1',
        name: 'John',
        time: '9:05 AM',
        avatar: '',
        text: 'Yes, it says "VPN connection failed. Authentication error."',
        chat: 'sender',
        open: false
    },
    {
        id: '2',
        name: 'Mark Davis',
        time: '10:00 AM',
        avatar: 'avatar-3.jpg',
        text: 'Thanks for the details. Can you confirm if you’ve recently changed your network password?',
        chat: 'receiver'
    },
    {
        id: '1',
        name: 'John',
        time: '10:32 AM',
        avatar: '',
        text: 'Yes, I changed it yesterday.',
        chat: 'sender',
        open: true
    },
    {
        id: '2',
        name: 'Mark Davis',
        time: '10:35 AM',
        avatar: 'avatar-3.jpg',
        text: 'That’s likely the issue. The VPN might still be using the old password. Try updating your VPN credentials with the new password.',
        chat: 'receiver'
    }
];

}