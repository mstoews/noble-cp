import { Component, Inject, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { addClass, extend } from '@syncfusion/ej2-base';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IKanban, KanbanService } from 'app/services/kanban.service';
import { MaterialModule } from 'app/services/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KanbanMenubarComponent } from '../kanban-menubar/grid-menubar.component';
import { RouterOutlet } from '@angular/router';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { DxDataGridModule } from 'devextreme-angular';
import { MatDrawer } from '@angular/material/sidenav';
import { CardClickEventArgs, CardRenderedEventArgs, ColumnsModel, SwimlaneSettingsModel, CardSettingsModel, KanbanModule } from '@syncfusion/ej2-angular-kanban';

export interface IValue {
    value: string;
    viewValue: string;
}

const imports = [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    CommonModule,
    RouterOutlet,
    CommonModule,
    KanbanModule,
    CheckBoxAllModule,
    KanbanMenubarComponent
  ]
  
  
@Component({
  selector: 'app-kanban-ex',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [imports],
  templateUrl: './kanban-ex.component.html',
  styleUrl: './kanban-ex.scss'
})

export class KanbanExComponent implements OnInit {
  kanbanData$: any;
  drawOpen: 'open' | 'close' = 'open';
  @ViewChild('drawer') drawer: MatDrawer;
  kanbanService = inject(KanbanService);
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  

  public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'assignee' };
  public bAdding?: boolean = false;
  
  taskGroup: FormGroup;
  sTitle = 'Add Kanban Task';
  cPriority: string;
  cRAG: string;
  cType: string;
  currentDate: Date;


  ngOnInit() { 
    this.kanbanData$ = this.kanbanService.getKanbanTaskList();
    this.createEmptyForm();
  }
  OnQueryCellInfo(): void {

  }

  OnCardClick(args: CardClickEventArgs): void {
    console.log(args.data);
  }


  OnDataBound(): void {

  }


  OnCardDoubleClick(args: CardClickEventArgs): void {
    this.bAdding = false;
    args.cancel = true;
    if (args.data  !== undefined) {
    
    const kanban = {
      id: args.data.id,
      title: args.data.title,
      status: args.data.status,
      summary: args.data.summary,
      type: args.data.type,
      priority: args.data.priority,
      tags: args.data.tags,
      estimate: args.data.estimate,
      assignee: args.data.assignee,
      rankid: args.data.rankid,
      color: args.data.color,
      className: '',
      updateUser: args.data.updateUser,
      updateDate: args.data.updateDate
    }
    this.createForm(kanban)     
    }   
    this.toggleDrawer();
  }

  assignees: IValue[] = [
    { value: 'mstoews', viewValue: 'mstoews' },
    { value: 'matthew', viewValue: 'matthew' },
    { value: 'admin', viewValue: 'admin' },
  ];

  createForm(task: IKanban) {
    this.sTitle = 'Kanban Task - ' + task.id;
    const dDate = new Date(task.updateDate);

    this.assignPriority(task);
    this.assignType(task);
    this.assignRag(task);

    var assignee = this.assignAssignee(task)

    this.taskGroup = this.fb.group({
      id: [task.id],
      title: [task.title],
      status: [task.status],
      summary: [task.summary],
      type: this.cType,
      priority: [this.cPriority],
      tags: [task.tags],
      estimate: [task.estimate],
      assignee: assignee,
      rankid: [task.rankid.toString()],
      color: [this.cRAG],
      updateDate: [dDate],
      updateUser: [task.assignee]
    });
  }


  createEmptyForm() {
    this.sTitle = 'Kanban Task';

    this.taskGroup = this.fb.group({
      title: [''],
      status: [''],
      summary: [''],
      type: [''],
      priority: [''],
      tags: [''],
      estimate: [''],
      assignee: [''],
      rankid: [''],
      color: [''],
      updateDate: [''],
      updateUser: [''],
    });
  }

  constructor() {
      
  }
  
  changeRag(e: any) {

  }

  changePriority(e: any) {

  }
  
  OnDragStop(e: any): void {
    const d = {
      id: e.data[0].id,
      status: e.data[0].status,
      rankid: e.data[0].rankid
    }
    console.log('Status', e.data[0].status);
    this.kanbanService.updateStatus(d);
  }
    
//   public columns: ColumnsModel[] = [
//       { headerText: 'To Do', keyField: 'Open', allowToggle: true },
//       { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
//       { headerText: 'In Review', keyField: 'Review', allowToggle: true },
//       { headerText: 'Done', keyField: 'Close', allowToggle: true }
//   ];

public columns: ColumnsModel[] = [
    { headerText: 'Initial', keyField: 'Open', allowToggle: false },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: false },
    { headerText: 'Completed', keyField: 'Review', allowToggle: false },
    { headerText: 'Confirmed', keyField: 'Close', allowToggle: false }
  ];
  

  public cardSettings: CardSettingsModel = {
      headerField: 'Title',
      template: '#cardTemplate',
      selectionType: 'Multiple'
  };
  
//   public dialogSettings: DialogSettingsModel = {
//       fields: [
//           { text: 'ID', key: 'Title', type: 'TextBox' },
//           { key: 'Status', type: 'DropDown' },
//           { key: 'Assignee', type: 'DropDown' },
//           { key: 'RankId', type: 'TextBox' },
//           { key: 'Summary', type: 'TextArea' }
//       ]
//   };
  
  types: IValue[] = [
    { value: 'Add', viewValue: 'Add' },
    { value: 'Update', viewValue: 'Update' },
    { value: 'Delete', viewValue: 'Delete' },
    { value: 'Verify', viewValue: 'Verify' },
  ];

 

  rag: IValue[] = [
    { value: '#238823', viewValue: 'Green' },
    { value: '#FFBF00', viewValue: 'Amber' },
    { value: '#D2222D', viewValue: 'Red' },
  ];


  
  public getString(assignee: string) {
      return assignee.match(/\b(\w)/g).join('').toUpperCase();
  }

  cardRendered(args: CardRenderedEventArgs): void {
      const val: string = (<{[key: string]: Object}>(args.data)).priority as string;      
      addClass([args.element], val);
  }


  


  onUpdate() {
    
    this.bAdding = false
    var data = this.taskGroup.getRawValue();
    var dDate = new Date(data.updateDate);
    data.updateDate = dDate.toISOString().split('T')[0];

    var assignee = this.assignees.find((x) => x.value === data.assignee);
    if (assignee !== undefined) {
      data.assignee = assignee.value;
    }
    var priority = this.priorities.find((x) => x.value === data.Priority);
    if (priority !== undefined) {
      data.priority = priority.value;
    }
    var type = this.types.find((x) => x.value === data.type);
    if (type !== undefined) {
      data.type = type.value;
    }
    var rag = this.rag.find((x) => x.value === data.color);
    if (rag !== undefined) {
      data.color = rag.value;
    }

    this.kanbanService.update(data)
    this.closeDrawer();
  }

  onCopy(e: any) {
    var data = this.taskGroup.getRawValue()

    const confirmation = this._fuseConfirmationService.open({
        title: `Copy Task: ${data.title}`,
        message: 'Are you sure you want to copy this task?',
        actions: {
            confirm: {
                label: 'Copy',
            },
        },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
            // Delete the list
            this.kanbanService.create(data);
        }
    });
    this.closeDrawer();

  }

  onDelete() {
    var data = this.taskGroup.getRawValue()
    this.kanbanService.delete(data);
  }

  onAssignment(data) {
    console.log(`${data}`);
  }

  closeDrawer() {
    this.kanbanService.read();
    //  this.drawer.toggle();
  }

  changeType(data) {
    // this.cType = data;
  }

  private assignType(task: IKanban) {
    if (task.type !== null && task.type !== undefined) {
      const type = this.types.find((x) => x.value === task.type.toString());
      if (type === undefined) {
        this.cType = 'Add';
      } else {
        this.cType = type.value;
      }
    } else {
      this.cType = 'Add';
    }
  }

  private assignAssignee(task: IKanban): string {
    var rc: string;
    if (task.assignee !== null && task.assignee !== undefined) {
      const assignee = this.assignees.find((x) => x.value === task.assignee.toString());
      if (assignee === undefined) {
        rc = 'mstoews';
      } else {
        rc = assignee.value;
      }
    } else {
      rc = 'admin'
    }
    return rc
  }

  private assignRag(task: IKanban) {
    if (task.color !== null && task.color !== undefined) {
      const rag = this.rag.find((x) => x.value === task.color.toString());
      if (rag === undefined) {
        this.cRAG = '#238823';
      } else {
        this.cRAG = rag.value;
      }
    } else {
      this.cRAG = '#238823';
    }
  }

  priorities: IValue[] = [
    { value: 'Critical', viewValue: 'Critical' },
    { value: 'High', viewValue: 'High' },
    { value: 'Normal', viewValue: 'Normal' },
    { value: 'Low', viewValue: 'Low' },
  ];


  private assignPriority(task: IKanban) {
    if (this.priorities !== undefined) {
      const priority = this.priorities.find(
        (x) => x.value === task.priority.toString()
      );
      if (priority !== undefined) {
        this.cPriority = priority.value;
      } else {
        this.cPriority = 'Normal';
      }
    } else {
      this.cPriority = 'Normal';
    }
  }
  
  toggleDrawer() {
    const opened = this.drawer.opened;
    if (opened !== true) {
      this.drawer.toggle();
    } else {
      if (this.drawOpen === 'close') {
        this.drawer.toggle();
      }
    }
  }


  onClear(): void {
    document.getElementById('EventLog').innerHTML = '';
  }

  // Menu
  onAdd() {
    this.bAdding = true;
    this.createEmptyForm()
    this.toggleDrawer();
  }

  onRefresh() {
    this.kanbanData$ = this.kanbanService.read()
    // add snackbar to confirm operations ...
  }
  onDeleteCurrentSelection() { }
  onUpdateCurrentSelection() { }

  onAddNew() {
    var data = this.taskGroup.getRawValue();
    this.kanbanService.create(data)
    this.kanbanData$ = this.kanbanService.read();
    this.closeDrawer();
  }

 

}
