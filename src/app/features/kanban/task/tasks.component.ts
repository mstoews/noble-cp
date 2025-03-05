import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardClickEventArgs, KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { addClass } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, CardRenderedEventArgs } from '@syncfusion/ej2-angular-kanban';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { provideNativeDateAdapter } from '@angular/material/core';
import { KanbanMenubarComponent } from '../kanban/kanban-menubar/grid-menubar.component';
import { AUTH } from 'app/app.config';

import { KanbanStore } from '../kanban.store';
import { debounce, defer, from, Observable, of, take, timer } from 'rxjs';
import { IKanban } from 'app/models/kanban';
import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { KanbanDrawerComponent } from './kanban-drawer.component';

const imports = [
  MaterialModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,  
  KanbanModule,
  CheckBoxAllModule,
  GridMenubarStandaloneComponent,
  KanbanDrawerComponent  
]

@Component({
    selector: 'kanban',
    encapsulation: ViewEncapsulation.None,
    imports: [imports],
    template: `
    <div class="flex flex-col min-w-0 overflow-y-auto bg-transparent" cdkScrollable>
    <mat-drawer class="w-[450px]"  #drawer [opened]="false" mode="push" [position]="'end'"
                [disableClose]="false">
                <kanban-drawer
                    [tasks] = "selectedTask$ | async"
                    (Cancel)="onCancel()"
                    (Update)="onUpdate($event)"
                    (Add)="onAdd($event)"
                    (Copy)="onCopy($event)"
                    (Delete)="onDelete($event)"></kanban-drawer>
    </mat-drawer>

    <div class="flex-auto overflow-hidden">
        <grid-menubar class="mb-2 mt-2" [showBack]="true" (back)="onBack()" [inTitle]="'Project Tasks'">
        </grid-menubar>
        
        <div class="h-full rounded-2xl overflow-hidden mt-2">
            
            <mat-drawer-container class="overflow-hidden">
                <mat-drawer-content>
                    @if (store.isLoading() == false) {
                    <div class="" cdkScrollable>
                        <div class="control-section overflow-hidden">
                            <div class="content-wrapper">
                                <ejs-kanban #kanbanObj cssClass='kanban-overview' keyField="status"
                                    [dataSource]='store.tasks()' [cardSettings]='cardSettings' enableTooltip='false'
                                    [swimlaneSettings]='swimlaneSettings' (cardDoubleClick)='OnCardDoubleClick($event)'
                                    (dragStart)='OnDragStart($event)' (drag)='OnDrag($event)'
                                    (dragStop)='OnDragStop($event)' (cardRendered)='cardRendered($event)'>
                                    <e-columns>
                                        <e-column class="text-gray-400" *ngFor="let column of columns;"
                                            headerText={{column.headerText}} keyField='{{column.keyField}}'
                                            allowToggle='{{column.allowToggle}}'>
                                            <ng-template #template let-data>
                                                <div class="header-template-wrap">
                                                    <div class="header-icon e-icons {{data.keyField}}"></div>
                                                    <div class="header-text text-gray-300">{{data.headerText}}</div>
                                                </div>
                                            </ng-template>
                                        </e-column>
                                    </e-columns>
                                    <ng-template #cardSettingsTemplate let-data>
                                        <div class='card-template'>
                                            <div class='e-card-header'>
                                                <div class='e-card-header-caption'>
                                                    <div class='e-card-header-title e-tooltip-text'>{{data.title}}</div>
                                                </div>
                                            </div>
                                            <div class='e-card-content e-tooltip-text'>
                                                <div class='e-text'>{{data.summary}}</div>

                                                <div class='e-date'>Start :{{data.startdate}}</div>
                                                <div class='e-date'>Estimate: {{data.estimatedate}}</div>

                                            </div>
                                            <div class='e-card-custom-footer'>
                                                <div class="e-card-tag-field e-tooltip-text">                                                
                                                  @for (tag of data.tags.split(','); track tag) {
                                                    {{tag}}
                                                  }
                                                  </div>
                                                <div class='e-card-avatar'>{{getString(data.assignee)}}</div>
                                            </div>
                                        </div>
                                    </ng-template>
                                </ejs-kanban>
                            </div>
                        </div>
                    </div>
                    } @else
                    {
                    <div class="flex flex-col items-center justify-center h-screen mat-spinner-color w-full bg-white">
                        <div class="flex justify-center items-center">
                            <mat-spinner>Loading ...</mat-spinner>
                        </div>
                    </div>
                    }
                </mat-drawer-content>
            </mat-drawer-container>
        </div>
      </div>
    </div>
    `,
    styleUrl: './tasks.component.scss',
    providers: [provideNativeDateAdapter(), KanbanStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {

  private _fuseConfirmationService = inject(FuseConfirmationService)
  private drawer = viewChild<MatDrawer>("drawer");
  
  
  public drawOpen: 'open' | 'close' = 'open';
  public taskGroup: FormGroup;
  public sTitle = 'Add Kanban Task';
  
  public currentDate = new Date().toISOString().split('T')[0];

  public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'assignee' };
  public  currentUser = inject(AUTH).currentUser;

  public selectedTask$! : Observable<IKanban>;
    
  // kanbanService = inject(KanbanService);
  store = inject(KanbanStore);
  
  ngOnInit() {
    this.bAdding = true;    
  }
  
  OnDragStop(e: any): void {
    const d = {
      id: e.data[0].id,
      status: e.data[0].status,
      rankid: e.data[0].rankid,
      priority: e.data[0].priority,
    }
    console.debug('Status', e.data[0].status);
    if (e.data[0].status === 'Close') {
      d.priority = 'Normal'
    }
    this.store.updateStatus(d);
  }

  OnCardDoubleClick(args: CardClickEventArgs): void {
    this.bAdding = false;
    const userName = '@' + this.currentUser.email.split('@')[0];
    const dDate = new Date()
    var currentDate = dDate.toISOString().split('T')[0];

    args.cancel = true;
    const kanban = {
      id: args.data.id,
      title: args.data.title,
      status: args.data.status,
      summary: args.data.summary,
      kanban_type: args.data.type,
      priority: args.data.priority,
      tags: args.data.tags,
      estimate: args.data.estimate,
      assignee: args.data.assignee,
      rankid: args.data.rankid,
      color: args.data.color,
      className: '',
      updateuser: userName,
      updatedate: currentDate,
      startdate: args.data.startdate,
      estimatedate: args.data.estimatedate
    } as IKanban;
    this.selectedTask$ = of(kanban);
    this.drawer().open();    
  }

  onBack() {
      throw new Error('Method not implemented.');
  }

  onCancel() {
    this.drawer().close();
  }  
    
  public columns: ColumnsModel[] = [
    { headerText: 'Initial', keyField: 'Open', allowToggle: true },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
    { headerText: 'Completed', keyField: 'Review', allowToggle: true },
    { headerText: 'Confirmed', keyField: 'Close', allowToggle: true }
  ];

  public cardSettings: CardSettingsModel = {
    headerField: 'id',
    template: '#cardTemplate',
    selectionType: 'Multiple'
  };

  public bAdding?: boolean = true;

  onUpdate(task: IKanban) {    
    if (task.id === null || task.id === undefined) {
      this.onAdd(task)
      return
    }
    else {
      this.bAdding = false;
      this.store.updateTask(task);
      this.closeDrawer();
    }
  }

  onCopy(kanban: IKanban) {
    const confirmation = this._fuseConfirmationService.open({
      title: `Copy Task: ${kanban.title}`,
      message: 'Are you sure you want to copy this task?',
      actions: {
        confirm: {
          label: 'Copy',
        },
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.store.addTasks(kanban)
      }
    });
    this.closeDrawer();

  }

  onDelete(kanban: IKanban) {    
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete Task: ${kanban.title}`,
      message: 'Are you sure you want to delete this task?',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.store.removeTask(kanban);
      }
    });

    this.closeDrawer();
  }

  onAssignment(data) {
    console.debug(`${data}`);
  }

  closeDrawer() {
    this.drawer().close();
  }

  changeType(data) {
    // this.cType = data;
  }

  OnDragStart(e){
    console.debug(e);
  }


  toggleDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      if (this.drawOpen === 'close') {
        this.drawer().toggle();
      }
    }
  }


  public getString(assignee: string): string {
    var assign = assignee
    if (assignee != null) {
      return assign!.match(/\b(\w)/g).join('').toUpperCase();
    }
    return "";
  }

  cardRendered(args: CardRenderedEventArgs): void {
    const val: string = (<{ [key: string]: Object; }>(args.data))['priority'] as string;
    addClass([args.element], val);
  }

  onClear(): void {
    document.getElementById('EventLog').innerHTML = '';
  }

  // Menu
  onAdd(kanban: IKanban) {
    this.bAdding = true;    
    this.toggleDrawer();
  }

  addNew(kanban: IKanban) {
    this.bAdding = true;
    var sub = this.store.addTask(kanban);
    this.toggleDrawer();
  }
  
  OnCardClick(args: CardClickEventArgs): void {
    console.log(args.data);
  }

}