import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { DxBulletModule, DxDataGridComponent, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';

import { KanbanMenubarComponent } from '../kanban/kanban-menubar/grid-menubar.component';
import { AUTH } from 'app/app.config';
import { KanbanService, IKanban } from '../kanban.service';
import { KanbanStore} from '../kanban.store'


interface IValue {
  value: string;
  viewValue: string;
}


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

@Component({
  selector: 'kanban-list',
  standalone: true,
  imports: [imports],
  templateUrl: './kanban-list.component.html',
  styleUrls: ['./kanban-list.scss'],
  providers: [KanbanStore]
})
export class KanbanListComponent implements OnInit {
  onCopy() {
    throw new Error('Method not implemented.');
  }

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


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  public data: any;
  drawOpen: 'open' | 'close' = 'open';

  private _fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  auth = inject(AUTH);
  store = inject(KanbanStore);


  @ViewChild('drawer') drawer!: MatDrawer;

  public sTitle = 'Kanban List';
  public taskGroup!: FormGroup;
  public data$: any
  
  bAdding: any;

  cPriority: string;
  cRAG: string;
  cType: string;

  ngOnInit() {
    this.createEmptyForm();
    
  }
  
  onCellDblClick(e: any) {
    this.OnCardDoubleClick(e.data)
  }
  
 
  OnCardDoubleClick(data: any): void {
    this.bAdding = false;
    const email = this.auth.currentUser.email;
    const dDate = new Date()
    var currentDate = dDate.toISOString().split('T')[0];

    const kanban = {
      id: data.id,
      title: data.title,
      status: data.status,
      summary: data.summary,
      type: data.type,
      priority: data.priority,
      tags: data.tags,
      estimate: data.estimate,
      assignee: data.assignee,
      rankid: data.rankid,
      color: data.color,
      className: '',
      updateuser: email,
      updatedate: currentDate,
      startdate: data.startdate,
      estimatedate: data.estimatedate
    } as IKanban;

    this.createForm(kanban)
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


  createForm(task: IKanban) {
    this.sTitle = 'Kanban Task - ' + task.id;
    const user = this.auth.currentUser;

    const dDate = new Date()
    var currentDate = dDate.toISOString().split('T')[0];
    if (task.estimatedate === null)
      task.estimatedate = currentDate;

    this.taskGroup = this.fb.group({
      id: [task.id],
      title: [task.title, Validators.required],
      status: [task.status],
      summary: [task.summary, Validators.required],
      type: [task.type],
      priority: [task.priority, Validators.required],
      tags: [task.tags, Validators.required],
      estimate: [task.estimate, Validators.required],
      assignee: [task.assignee],
      rankid: [task.rankid.toString()],
      color: [task.color],
      updatedate: [currentDate],
      updateuser: [user.email, Validators.required],
      startdate: [task.startdate, Validators.required],
      estimatedate: [task.estimatedate, Validators.required]

    });
    this.openDrawer();
  }



  onCreate(e: any) {    
    this.createEmptyForm();
    this.openDrawer();
  }

  onDelete(e: any) {
    console.debug(`onDelete ${JSON.stringify(e)}`);
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Type?',
      message: 'Are you sure you want to delete this type? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Delete the listconst dDate = new Date();
        const task = this.taskGroup.getRawValue();
        const user = this.auth.currentUser;
        var currentDate = new Date().toISOString().split('T')[0];
        
        var data = {
        id : task.id,
        title: task.title,
        status: task.status,
        summary: task.summary,
        type: task.type,
        priority: task.priority,
        tags: task.tags,
        estimate: task.estimate,
        assignee: task.assignee,
        rankid: task.rankid,
        color: '',
        updatedate: currentDate,
        updateuser: user.email,
        startdate: task.startdate,
        estimatedate: task.estimatedate
        } as IKanban;

        this.store.removeTask(data)
      }
    });
    this.closeDrawer();
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
      startdate: [''],
      estimatedate: ['']
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

  onUpdate() {
    const dDate = new Date();
    const task = this.taskGroup.getRawValue();
    const user = this.auth.currentUser;
    var currentDate = dDate.toISOString().split('T')[0];
    
    
    var data = {
      id : task.id,
      title: task.title,
      status: task.status,
      summary: task.summary,
      type: task.type,
      priority: task.priority,
      tags: task.tags,
      estimate: task.estimate,
      assignee: task.assignee,
      rankid: task.rankid,
      color: '',
      updatedate: currentDate,
      updateuser: user.email,
      startdate: task.startdate,
      estimatedate: task.estimatedate
    } as IKanban;

    this.store.updateTask(data);  /// the last time 
    this.closeDrawer();
  }

  onRefresh() {
    // this.tasksList = this.kanbanService.read()
  }

  
  onAdd() {
    this.openDrawer()
  }
  onDeleteCurrentSelection() {
    throw new Error('Method not implemented.');
  }
  onUpdateCurrentSelection() {
    throw new Error('Method not implemented.');
  }
  changeRag($event: any) {
    throw new Error('Method not implemented.');
  }
  changeType($event: any) {
    throw new Error('Method not implemented.');
  }
  changePriority(arg0: any) {
    throw new Error('Method not implemented.');
  }

}

