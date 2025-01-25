import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Component, OnInit, ViewChild, inject, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { MatDrawer } from "@angular/material/sidenav";
import { MaterialModule } from "app/services/material.module";
import { KanbanMenubarComponent } from "../kanban/kanban-menubar/grid-menubar.component";
import {DialogEditEventArgs, GridModule, SaveEventArgs 
} from "@syncfusion/ej2-angular-grids";
import { DropDownListComponent, DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";

import { AUTH } from "app/app.config";
import { IKanban } from "app/models/kanban";
import { KanbanStore } from "../kanban.store";

import { Store } from '@ngrx/store';

import { KanbanPageActions } from "app/state/kanban-state/kanban/actions/kanban-page.actions";
import { kanbanFeature } from "app/state/kanban-state/kanban/kanban.state";
import { GLGridComponent } from "app/features/accounting/grid-components/gl-grid.component";
import { GridMenubarStandaloneComponent } from "app/features/accounting/grid-components/grid-menubar.component";

interface IValue {
  value: string;
  viewValue: string;
}

const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  GridModule
];

@Component({
  selector: "kanban-list",
  imports: [imports],
  template: `   
  <ng-container>
    <grid-menubar [inTitle]="sTitle" (onCreate)="onCreate($event)"> </grid-menubar>                         
      
    @if (ngrxStore.isLoading() === false) 
     {     
        <gl-grid                             
            (onUpdateSelection)="onSelection($event)"
            [data]="ngrxStore.tasks()" 
            [columns]="columns">
        </gl-grid>                                 
     }
    @else
     {
        <div class="fixed z-[1050] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
            <mat-spinner></mat-spinner>
        </div>
     }
 </ng-container> 
`,
  styles: ``,
  providers: [
    KanbanStore,
    GLGridComponent,
    GridMenubarStandaloneComponent,
  ]
})
export class KanbanListComponent implements OnInit {

  private Store = inject(Store);
  private fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  public auth = inject(AUTH);

  store = inject(Store);
  kanban$ = this.store.select(kanbanFeature.selectTasks);
  selectedKanban$ = this.store.select(kanbanFeature.selectKanbanState);
  isLoading$ = this.store.select(kanbanFeature.selectLoading);

  ngrxStore = inject(KanbanStore);
  drawer = viewChild<MatDrawer>('drawer');

  ngOnInit() {
    this.createEmptyForm();
    this.Store.dispatch(KanbanPageActions.load());
  }

  columns = [
  { field : "id"          , headerText: "ID"      , visible: false, width:"100", sortOrder:"asc", isPrimaryKey:"true" },
  { field : "title"       , headerText: "Title"   , visible: true   },
  { field : "status"      , headerText: "Status"  , visible: true , width:"120"},
  { field : "summary"     , headerText: "Summary" , visible: true , width:"200"},
  { field : "kanban_type" , headerText: "Type"    , visible: true , width:"100"},
  { field : "priority"    , headerText: "Priority", visible: true , width:"120"},
  { field : "tags"        , headerText: "Tag"     , visible: true , width:"120"},
  { field : "estimate"    , headerText: "Estimate", visible: true , width:"130"},
  { field : "assignee"    , headerText: "Assignee", visible: true , width:"130"},
  { field : "rankid "     , headerText: "Rank ID" , visible: true , width:"70"},
  { field : "color"       , headerText: "Color"   , visible: true , width:"70"},
  ];

    
  types: IValue[] = [
    { value: "Add"   , viewValue: "Add" },
    { value: "Update", viewValue: "Update" },
    { value: "Delete", viewValue: "Delete" },
    { value: "Verify", viewValue: "Verify" },
  ];

  assignees: IValue[] = [
    { value: "mstoews", viewValue: "mstoews" },
    { value: "matthew", viewValue: "matthew" },
    { value: "admin", viewValue: "admin" },
  ];

  rag: IValue[] = [
    { value: "#238823", viewValue: "Green" },
    { value: "#FFBF00", viewValue: "Amber" },
    { value: "#D2222D", viewValue: "Red" },
  ];

  priorities: IValue[] = [
    { value: "Critical", viewValue: "Critical" },
    { value: "High", viewValue: "High" },
    { value: "Normal", viewValue: "Normal" },
    { value: "Low", viewValue: "Low" },
  ];

  public data: any;
  drawOpen: "open" | "close" = "open";


  
  public sTitle = "Kanban List";
  public taskGroup!: FormGroup;
  public data$: any;

  public bAdding: any;
  public cRAG: string;
  public cType: string;


  onCellDblClick(e: any) {
    this.OnCardDoubleClick(e.data);
  }

  OnCardDoubleClick(data: any): void {
    this.bAdding = false;
    const email = this.auth.currentUser.email;
    const dDate = new Date();
    var currentDate = dDate.toISOString().split("T")[0];

    const kanban = {
      id: data.id,
      title: data.title,
      status: data.status,
      summary: data.summary,
      kanban_type: data.type,
      priority: data.priority,
      tags: data.tags,
      estimate: data.estimate,
      assignee: data.assignee,
      rankid: data.rankid,
      color: data.color,
      className: "",
      updateuser: email,
      updatedate: currentDate,
      startdate: data.startdate,
      estimatedate: data.estimatedate,
    } as IKanban;

    this.createForm(kanban);
  }

  toggleDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      if (this.drawOpen === "close") {
        this.drawer().toggle();
      }
    }
  }

  private assignType(task: IKanban): string {
    if (task.kanban_type !== null && task.kanban_type !== undefined) {
      const type = this.types.find((x) => x.value === task.kanban_type.toString());
      if (type === undefined) {
        this.cType = "Add";
      } else {
        this.cType = type.value;
      }
    } else {
      this.cType = "Add";
    }
    return this.cType;
  }

  private assignAssignee(task: IKanban): string {
    var rc: string;
    if (task.assignee !== null && task.assignee !== undefined) {
      const assignee = this.assignees.find(
        (x) => x.value === task.assignee.toString()
      );
      if (assignee === undefined) {
        rc = "mstoews";
      } else {
        rc = assignee.value;
      }
    } else {
      rc = "admin";
    }
    return rc;
  }


  private assignRag(task: IKanban): string {
    if (task.color !== null && task.color !== undefined) {
      const rag = this.rag.find((x) => x.value === task.color.toString());
      if (rag === undefined) {
        this.cRAG = "#238823";
      } else {
        this.cRAG = rag.value;
      }
    } else {
      this.cRAG = "#238823";
    }
    return this.cRAG;
  }

  private assignPriority(task: IKanban): string {
    var cPriority: string;
    if (this.priorities !== undefined) {
      const priority = this.priorities.find(
        (x) => x.value === task.priority.toString()
      );
      if (priority !== undefined) {
        cPriority = priority.value;
      } else {
        cPriority = "Normal";
      }
    } else {
      cPriority = "Normal";
    }
    return cPriority;
  }

  createForm(task: IKanban) {
    this.sTitle = "Kanban Task - " + task.id;
    const user = this.auth.currentUser;

    const dDate = new Date();
    var currentDate = dDate.toISOString().split("T")[0];
    if (task.estimatedate === null) task.estimatedate = currentDate;

    this.taskGroup = this.fb.group({
      id: [task.id],
      title: [task.title, Validators.required],
      status: [task.status],
      summary: [task.summary, Validators.required],
      kanban_type: [task.kanban_type],
      priority: [task.priority, Validators.required],
      tags: [task.tags, Validators.required],
      estimate: [task.estimate, Validators.required],
      assignee: [task.assignee],
      rankid: [task.rankid.toString()],
      color: [task.color],
      updatedate: [currentDate],
      updateuser: [user.email, Validators.required],
      startdate: [task.startdate, Validators.required],
      estimatedate: [task.estimatedate, Validators.required],
    });
    this.openDrawer();
  }

  public pageSettings: Object;
  public formatoptions: Object;
  public initialSort: Object;
  
  public editSettings: Object;
  public dropDown: DropDownListComponent;
  public submitClicked: boolean = false;
  

  onCreate(e: any) {
    this.createEmptyForm();
    this.openDrawer();
  }


  actionBegin(args: SaveEventArgs): void {

    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      var data = args.rowData as IKanban;
      args.cancel = true;
      this.bAdding = false;
      const email = this.auth.currentUser.email;
      const dDate = new Date()
      var currentDate = dDate.toISOString().split('T')[0];

      args.cancel = true;
      const kanban = {
        id: data.id,
        title: data.title,
        status: data.status,
        summary: data.summary,
        kanban_type: data.kanban_type,
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
      this.createForm(data)
      this.openDrawer();

    }
    if (args.requestType === 'save') {
      console.log(JSON.stringify(args.data));
      var data = args.data as IKanban;
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      if (args.requestType === 'beginEdit') {
        // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
      } else if (args.requestType === 'add') {
        // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
      }
    }
  }

  onDelete(e: any) {
    console.debug(`onDelete ${JSON.stringify(e)}`);
    const confirmation = this.fuseConfirmationService.open({
      title: "Delete Task?",
      message: "Are you sure you want to delete this type? ",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Delete the list const dDate = new Date();
        const task = this.taskGroup.getRawValue();
        const user = this.auth.currentUser;
        var currentDate = new Date().toISOString().split("T")[0];

        var data = {
          id: task.id,
          title: task.title,
          status: task.status,
          summary: task.summary,
          kanban_type: task.type,
          priority: task.priority,
          tags: task.tags,
          estimate: task.estimate,
          assignee: task.assignee,
          rankid: task.rankid,
          color: "",
          updatedate: currentDate,
          updateuser: user.email,
          startdate: task.startdate,
          estimatedate: task.estimatedate,
        } as IKanban;

        this.ngrxStore.removeTask(data);
      }
    });
    this.closeDrawer();
  }

  createEmptyForm() {
    this.sTitle = "Kanban Task";

    this.taskGroup = this.fb.group({
      title: [""],
      status: [""],
      summary: [""],
      type: [""],
      priority: [""],
      tags: [""],
      estimate: [""],
      assignee: [""],
      rankid: [""],
      color: [""],
      updateDate: [""],
      updateUser: [""],
      startdate: [""],
      estimatedate: [""],
    });
  }

  onCopy() {
    throw new Error("Method not implemented.");
  }

  openDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  closeDrawer() {
    const opened = this.drawer().opened;
    if (opened === true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  onUpdate() {
    const dDate = new Date();
    const task = this.taskGroup.getRawValue();
    const user = this.auth.currentUser;
    var currentDate = dDate.toISOString().split("T")[0];

    var data = {
      id: task.id,
      title: task.title,
      status: task.status,
      summary: task.summary,
      kanban_type: task.type,
      priority: task.priority,
      tags: task.tags,
      estimate: task.estimate,
      assignee: task.assignee,
      rankid: task.rankid,
      color: "",
      updatedate: currentDate,
      updateuser: user.email,
      startdate: task.startdate,
      estimatedate: task.estimatedate,
    } as IKanban;

    this.ngrxStore.updateTask(data); /// the last time
    this.closeDrawer();
  }

  onRefresh() {
    // this.tasksList = this.kanbanService.read()
  }

  onAdd() {
    this.openDrawer();
  }
  onDeleteCurrentSelection() {

  }
  onUpdateCurrentSelection() {

  }
  changeRag($event: any) {

  }
  changeType($event: any) {

  }
  changePriority(arg: any) {


  }
}
