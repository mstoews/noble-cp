import { Component, ViewChild, OnInit,ViewEncapsulation } from '@angular/core';
import { ChatUIComponent, ChatUIModule, ToolbarSettingsModel, MessageSendEventArgs } from '@syncfusion/ej2-angular-interactive-chat';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons'
import { integrationMessagedata, integrationListTemplateData, botData, chatSuggestions, botMessagedata, walterMessagedata, lauraMessagedata, teamsMessagedate as teamsMessageDate, suyamaMessagedata } from './messageData';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'control-content',
  template: `
  <div class="control-section chat-integration" class="w-full h-full">
    <div class="integration-chatui" class="w-full h-full">
        <ejs-splitter id="splitter" class="w-full h-full">
            <e-panes>
                <e-pane size="auto" [resizable]='false' cssClass="chat-leftContent">
                    <ng-template #content>
                                <div id="toggle-chat-list" class="toggle-chat-listview e-card">
                                    <ejs-listview id="listview_template" #listView [dataSource]='data' cssClass="e-list-template" headerTitle='Chats' showHeader='true' (actionComplete)="onActionComplete()" (select)="onChatItemSelected($event)">
                                        <ng-template #template let-item>
                                            <div class="clearfix desc e-list-wrapper e-list-multi-line e-list-avatar">
                                              @if (item.imgSrc) {
                                                <img class="e-avatar" [src]="'./assets/images/avatars/' + item.imgSrc + '.jpg'" alt="image" style="border-radius: 50%;" />
                                                <span class="e-list-item-header">{{ item.title }}</span>
                                              }
                                              @if (item.message) {
                                                <div  class="chat_message" style="font-size: 12px;">
                                                    {{ item.message }}
                                                </div>
                                              }
                                            </div>
                                        </ng-template>
                                    </ejs-listview>
                                </div>
                        </ng-template>
                </e-pane>
                <e-pane size="80%" [resizable]='false' cssClass="chat-rightContent">
                    <ng-template #content>
                            <div id="integration-chat" color="primary" ejs-chatui #chatUI [user]="currentUser" [messages]="currentMessages" [headerText]="headerText" [headerIconCss]="headerIconCss" [headerToolbar]="headerToolbar" (messageSend)="onMessageSend($event)">
                                <ng-template #emptyChatTemplate>
                                    <div class="emptychat-content">
                                        <h3><span class="e-icons e-comment-show"></span></h3>
                                        <div class="emptyChatText">No conversations yet</div>
                                    </div>
                                </ng-template>
                            </div>
                    </ng-template>
                </e-pane>
            </e-panes>
        </ejs-splitter>
    </div>
  </div>

  `,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ChatUIModule, ButtonModule, CommonModule, ListViewModule, SplitterModule]
})
export class ChatComponent implements OnInit {
  @ViewChild('chatUI') public chatUI: ChatUIComponent;
  @ViewChild('listView') public listView: ListViewComponent;

  public data = integrationListTemplateData;
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
}