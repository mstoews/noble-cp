import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardClickEventArgs, KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { addClass } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, CardRenderedEventArgs } from '@syncfusion/ej2-angular-kanban';
import { IKanban, KanbanService } from 'app/services/kanban.service';
import { DxDataGridModule } from 'devextreme-angular';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { provideNativeDateAdapter } from '@angular/material/core';
import { KanbanMenubarComponent } from '../kanban/kanban-menubar/grid-menubar.component';
import { AUTH } from 'app/app.config';


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
  selector: 'kanban',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [imports],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class TasksComponent {
  @ViewChild('kanbanObj') kanbanObj!: KanbanComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  private fb = inject(FormBuilder);
  private kanbanService = inject(KanbanService);
  drawOpen: 'open' | 'close' = 'open';
  team: any[];
  taskGroup: FormGroup;
  sTitle = 'Add Kanban Task';
  cPriority: string;
  cRAG: string;
  cType: string;
  currentDate: Date;
  auth = inject(AUTH);
  
  kanbanData = this.kanbanService.read();

  private _fuseConfirmationService = inject(FuseConfirmationService)

  ngOnInit(): void {
    this.bAdding = true;
    this.createEmptyForm();
  }


  // these values should be replaced with data from the database

  types: IValue[] = [
    { value: 'Add', viewValue: 'Add' },
    { value: 'Update', viewValue: 'Update' },
    { value: 'Delete', viewValue: 'Delete' },
    { value: 'Verify', viewValue: 'Verify' },
  ];

  assignees: IValue[] = [
    { value: 'mstoews', viewValue: 'mstoews' },
    { value: 'matthew', viewValue: 'matthew' },
    { value: 'admin', viewValue: 'admin' },
  ];


  rag: IValue[] = [
    { value: '#238823', viewValue: 'Green' },
    { value: '#FFBF00', viewValue: 'Amber' },
    { value: '#D2222D', viewValue: 'Red' },
  ];

  priorities: IValue[] = [
    { value: 'Critical', viewValue: 'Critical' },
    { value: 'High', viewValue: 'High' },
    { value: 'Normal', viewValue: 'Normal' },
    { value: 'Low', viewValue: 'Low' },
  ];

  OnDragStop(e: any): void {
    const d = {
      id: e.data[0].id,
      status: e.data[0].status,
      rankid: e.data[0].rankid,
      priority: e.data[0].priority,
    }
    console.log('Status', e.data[0].status);
    if (e.data[0].status === 'Close') {
      d.priority = 'Normal'
    }
    this.kanbanService.updateStatus(d);
  }

  OnCardDoubleClick(args: CardClickEventArgs): void {
    this.bAdding = false;
    const email = this.auth.currentUser.email;
    const dDate = new Date()
    var currentDate = dDate.toISOString().split('T')[0];
    

    args.cancel = true;
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
      className:  args.data.className,
      updateUser: email,
      updateDate: currentDate,
      startDate: args.data.start_date,
      estimateDate: args.data.estimate_date
    }
    this.createForm(kanban)
    this.toggleDrawer();
  }

  createEmptyForm() {
    this.bAdding = true;
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
      startDate: [''],
      estimateDate: ['']
    });
  }


  

  createForm(task: IKanban) {
    this.sTitle = 'Kanban Task - ' + task.id;
    const user = this.auth.currentUser;
    
    const dDate = new Date()
    var currentDate = dDate.toISOString().split('T')[0];
    
    const priority = this.assignPriority(task);
    this.assignType(task);
    this.assignRag(task);

    var assignee = this.assignAssignee(task)

    if (task.estimateDate === null)
      task.estimateDate = currentDate;

    this.taskGroup = this.fb.group({
      id: [task.id],
      title: [task.title],
      status: [task.status],
      summary: [task.summary],
      type: this.cType,
      priority: [priority],
      tags: [task.tags],
      estimate: [task.estimate],
      assignee: assignee,
      rankid: [task.rankid.toString()],
      color: [this.cRAG],
      updateDate: [currentDate],
      updateUser: [user.email],
      startDate: [task.startDate],
      estimateDate: [task.estimateDate]
      
    });
  }

  private assignType(task: IKanban): string {
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
    return this.cType;
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

  private assignRag(task: IKanban): string {
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
    return this.cRAG;
  }

  private assignPriority(task: IKanban): string {
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
    return this.cPriority
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

  onUpdate() {    
    const data = this.taskGroup.getRawValue()
    if (data.id === null || data.id === undefined) {
      this.onAddNew()
      return 
    }
    else {
      this.bAdding = false;
      this.kanbanService.update(this.taskGroup.getRawValue());
      //this.kanbanData = this.kanbanService.read();
      this.closeDrawer();
    }
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

    
    confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
            this.kanbanService.create(data);
        }
    });
    
    this.closeDrawer();

  }

  onDelete() {
    var data = this.taskGroup.getRawValue()
    
    const confirmation = this._fuseConfirmationService.open({
        title: `Delete Task: ${data.title}`,
        message: 'Are you sure you want to delete this task?',
        actions: {
            confirm: {
                label: 'Delete',
            },
        },
    });

    confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {            
            this.kanbanService.delete(data);
        }
    });
    
    this.closeDrawer();
  }

  onAssignment(data) {
    console.log(`${data}`);
  }

  closeDrawer() {
    this.drawer.toggle();
  }

  changeType(data) {
    // this.cType = data;
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

  public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'assignee' };

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
  onAdd() {
    this.bAdding = true;
    this.createEmptyForm()
    this.toggleDrawer();
  }

  onRefresh() {
    this.kanbanData = this.kanbanService.read();
  }

  onDeleteCurrentSelection() { }
  
  onUpdateCurrentSelection() { }

  onAddNew() {
    var data = this.taskGroup.getRawValue();
    const startDate = new Date(data.startDate).toISOString().split('T')[0];
    const estimateDate = new Date(data.estimateDate).toISOString().split('T')[0];

    var dt = 
      {
         title: data.title ,
         status: "Open",
         summary: data.summary,
         type: data.type,
         priority: data.priority,
         tags: data.tags,
         assignee: data.assignee,
         rankid: 1,
         color:"#238823",
         estimate: Number(data.estimate) ,
         estimateDate: estimateDate,
         className: "class",
         updateDate: estimateDate,
         updateUser: "mstoews",
         startDate: startDate
      }
      
    var sub = this.kanbanService.create(dt).subscribe(kanban => {      
        var kanbanList = kanban;
        this.kanbanService.updateKanbanList(kanbanList)
    })

    this.closeDrawer();
  }

  OnActionBegin(): void {

  }

  OnActionComplete(): void {

  }

  OnActionFailure(): void {

  }

  OnDataBinding(): void {

  }

  OnDataBound(): void {

  }

  OnCardRendered(args: CardRenderedEventArgs): void {

  }

  OnQueryCellInfo(): void {

  }

  OnCardClick(args: CardClickEventArgs): void {
    // console.log(args.data);
  }


  OnDragStart(e): void {

  }

  OnDrag(e): void {

  }


  changeRag(e: any) {

  }

  changePriority(e: any) {

  }


}