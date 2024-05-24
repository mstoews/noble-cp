import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { IKanban, KanbanService } from 'app/services/kanban.service';
import { KanbanMenubarComponent } from './kanban/kanban-menubar/grid-menubar.component';

const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
  
  KanbanMenubarComponent
];

interface IValue {
    value: string;
    viewValue: string;
  }
  

@Component({
  selector: 'kanban-list',
  standalone: true,
  imports: [imports],
  templateUrl: './kanban-list.component.html',
  styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
      background-color: rgb(195, 199, 199);
      border-color: #ada6a7;
      }`,
  providers: []
})
export class KanbanListComponent implements OnInit {

taskGroup: FormGroup;

  public data: any;

  private _fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);

  private kanbanService = inject(KanbanService);
  @ViewChild('drawer') drawer!: MatDrawer;
  public sTitle = 'Kanban List';
  public accountsForm!: FormGroup;
  public kanbanData$: any
  public typeForm?: FormGroup | any;
  bAdding = false;
  
  drawOpen: 'open' | 'close' = 'open';

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
    cType: string;
    cRAG: string;
    cPriority: string;


  ngOnInit() {      
      this.onRefresh();
      this.createEmptyForm();
  }

  onCreate(e: any) {
      this.createEmptyForm();
      this.openDrawer();
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
      startDate: [''],
      estimateDate: ['']
    });
  }



  openDrawer() {
      const opened = this.drawer.opened;
      if (opened !== true) {
          this.drawer.toggle();
      } else {
          return;
      }
  }

  closeDrawer() {
      const opened = this.drawer.opened;
      if (opened === true) {
          this.drawer.toggle();
      } else {
          return;
      }
  }


  createForm(task: IKanban) {
    this.sTitle = 'Kanban Task - ' + task.id;
    const dDate = new Date(task.updateDate);
    
    const priority = this.assignPriority(task);
    this.assignType(task);
    this.assignRag(task);

    var assignee = this.assignAssignee(task)

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
      updateDate: [dDate],
      updateUser: [task.assignee],
      startDate: [task.startDate],
      estimateDate: [task.estimateDate]
    });
  }

  onCellDoubleClicked(e: any){
    this.createForm(e.data);
    this.openDrawer()
  }


  onAdd() {    
    this.createEmptyForm();
    this.openDrawer()
  }
  
  onRefresh() {
    this.kanbanData$ = this.kanbanService.read()
  }
  
  onUpdateCurrentSelection() {
    throw new Error('Method not implemented.');
    }
  
  onDeleteCurrentSelection() {
    throw new Error('Method not implemented.');
  }

  onAddNew() {
    var data = this.taskGroup.getRawValue();
    this.kanbanService.create(data)
    this.kanbanData$ = this.kanbanService.read();
    this.closeDrawer();
  }
    
  onUpdate() {
    // const cardIds = this.kanbanObj.kanbanData.map((obj: { [key: string]: string }) => parseInt(obj.Id.replace('', ''), 10));
    this.bAdding = false
    const updateDate = new Date().toISOString().split('T')[0];
    var task = this.taskGroup.getRawValue();
    task.priority = this.assignPriority(task);
    task.rag = this.assignRag(task);
    task.assignee =  this.assignAssignee(task);
    task.type = this.assignType(task);
    task.updateDate = updateDate;
    task.startDate =  task.startDate.split('T')[0];
    task.estimateDate = task.estimateDate;
    this.kanbanService.update(task);
    this.kanbanData$ = this.kanbanService.read();
    this.closeDrawer();
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

  changePriority(e: any) {
    console.debug(JSON.stringify(e))
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


}

