import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IKanban, IPriority, ITeam, IType } from 'app/models/kanban';
import { IValue } from 'app/models/types';
import { MaterialModule } from 'app/shared/material.module';

@Component({
  selector: 'kanban-drawer',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule,],
  template: `        
  <mat-card class="mt-2 ml-3 mr-3 mat-elevation-z8">
      <div mat-card-title
          class="font-semibold text-3xl text-gray-100 bg-gray-500 p-1 border-white m-1 rounded-md">
          {{sTitle}}
      </div>
      <div mat-card-content class="border-r-green-500">
          <form [formGroup]="taskGroup" class="form">
              <div class="flex flex-col m-1">
                  <div class="flex flex-col grow">
                      <mat-form-field class="mt-1 flex-start">
                          <input #myInput matInput placeholder="Kanban Task Title"
                              formControlName="title" />
                          <mat-icon class="icon-size-5" matPrefix
                              [svgIcon]="'heroicons_solid:document'"></mat-icon>
                      </mat-form-field>
                  </div>

                  <section class="flex flex-col md:flex-row gap-2">
                      <mat-form-field class="grow">
                          <mat-select placeholder="Type" formControlName="type"
                              (selectionChange)="changeType($event)">
                              @for(item of types(); track item.type) {
                                <mat-option [value]="item.type"> {{ item.type}} </mat-option>
                              }                              
                          </mat-select>
                      </mat-form-field>

                      <mat-form-field class="grow">
                          <mat-select placeholder="Priority" formControlName="priority"
                              (selectionChange)="changePriority($event.value)">
                              @for (item of priority(); track item.priority) {
                               <mat-option [value]="item.priority"> {{ item.priority }} </mat-option>
                              }
                          </mat-select>
                      </mat-form-field>
                  </section>

                  <mat-form-field class=" grow gap-2">
                      <input matInput placeholder="Tags" formControlName="tags" />
                  </mat-form-field>

                  <section class="flex flex-col md:flex-row gap-2">
                      <mat-form-field class="grow">
                          <mat-date-range-input [rangePicker]="picker">
                              <input matStartDate formControlName="startdate" placeholder="Start date">
                              <input matEndDate formControlName="estimatedate" placeholder="End date">
                          </mat-date-range-input>
                          <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
                          <mat-date-range-picker #picker></mat-date-range-picker>

                          @if (taskGroup.controls.startdate.hasError('matStartDateInvalid')) {
                          <mat-error>Invalid start date</mat-error>
                          }
                          @if (taskGroup.controls.estimatedate.hasError('matEndDateInvalid')) {
                          <mat-error>Invalid end date</mat-error>
                          }
                      </mat-form-field>

                      <mat-form-field class="grow">
                          <input matInput placeholder="Estimate (Days)" formControlName="estimate" />
                      </mat-form-field>
                  </section>

                  <mat-form-field class="form-element gap-2">
                      <mat-select placeholder="Assigned" formControlName="assignee"
                          (selectionChange)="changeType($event.value)">
                          @for (item of team(); track item) {
                          <mat-option [value]="item.team_member">
                              {{ item.team_member }}
                          </mat-option>
                          }
                      </mat-select>
                  </mat-form-field>

                  <mat-form-field class="mat-form-field">
                      <textarea matInput placeholder="Summary" formControlName="summary"> </textarea>
                  </mat-form-field>
              </div>
          </form>

          <div mat-dialog-actions class="gap-2 mb-3">
        @if (bDirty === true) {
          <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
            matTooltip="Save" aria-label="hovered over">
            <span class="e-icons e-save"></span>
          </button>
          }

          <button mat-icon-button color="primary" 
                  class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">                        
              <span class="e-icons e-circle-add"></span>
          </button>

          <button mat-icon-button color="primary" 
                  class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete" aria-label="hovered over">                        
              <span class="e-icons e-trash"></span>
          </button>

          <button mat-icon-button color="primary" 
                  class=" hover:bg-slate-400 ml-1" (click)="onCopy()" matTooltip="Clone" aria-label="hovered over"> 
              <span class="e-icons e-copy"></span>
          </button>

          <button mat-icon-button color="primary"
                  class=" hover:bg-slate-400 ml-1"  (click)="onClose()" matTooltip="Close"
                  aria-label="hovered over">
                <span class="e-icons e-circle-close"></span>
          </button>                    
  </div>
      </div>
  </mat-card>
  `,
  styles: ``
})
export class KanbanDrawerComponent {

  sTitle = 'Kanban Task';
  cPriority: string;
  cRAG: string;
  cType: string;
  bDirty = true;

  tasks = input<IKanban | null>();
  team = input<ITeam[] | null>();
  types = input<IType[] | null>();
  priority = input<IPriority[] | null>();

  Update = output<IKanban>();
  Add = output<IKanban>();
  Delete = output<IKanban>();
  Copy = output<IKanban>();
  Cancel = output();
  CloseDrawer = output();

  taskGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    status: new FormControl(''),
    summary: new FormControl('', Validators.required),
    type: new FormControl(''),
    priority: new FormControl('', Validators.required),
    tags: new FormControl('', Validators.required),
    estimate: new FormControl(0, Validators.required),
    assignee: new FormControl('', Validators.required),
    rankid: new FormControl(0),
    color: new FormControl(''),
    updatedate: new FormControl(''),
    updateuser: new FormControl('', Validators.required),
    startdate: new FormControl('', Validators.required),
    estimatedate: new FormControl('', Validators.required)
  });

  rag: IValue[] = [
    { value: '#238823', viewValue: 'Green' },
    { value: '#FFBF00', viewValue: 'Amber' },
    { value: '#D2222D', viewValue: 'Red' },
  ];

  ngOnChanges() {
    if (this.tasks) {
      this.taskGroup.patchValue(this.tasks());
    }
  }


  onClose() {
    this.CloseDrawer.emit();
    this.Cancel.emit();
  }

  onDelete() {
    this.Delete.emit(this.updateTasks());
  }

  onAdd() {
    this.Delete.emit(this.updateTasks());
  }

  onUpdate() {
    this.Update.emit(this.updateTasks());
  }

  onCopy() {
    this.Copy.emit(this.updateTasks());
  }

  updateTasks(): IKanban {
    const updateDate = new Date().toISOString().split('T')[0];
    const data = { ...this.taskGroup.value };

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
      className: '',
      updateuser: data.updateuser,
      updatedate: updateDate,
      startdate: data.startdate,
      estimatedate: data.estimatedate
    } as unknown as IKanban;
    return kanban;
  }

  changeType(event: any) {

  }



  createForm(task: IKanban) {
    this.sTitle = 'Kanban Task - ' + task.id;

    var currentDate = new Date().toISOString().split('T')[0];

    const priority = this.assignPriority(task);
    const taskType = this.assignType(task);
    const rag = this.assignRag(task);

    if (task.estimatedate === null) {
      task.estimatedate = currentDate;
    }

    this.taskGroup.patchValue({
      id: task.id,
      title: task.title,
      status: task.status,
      summary: task.summary,
      type: taskType,
      priority: priority,
      tags: task.tags,
      estimate: task.estimate,
      assignee: task.assignee,
      rankid: task.rankid,
      color: rag,
      updatedate: currentDate,
      updateuser: task.updateuser,
      startdate: task.startdate,
      estimatedate: task.estimatedate,
    });
  }


  public changePriority(e: any) {

  }

  onAddNew() {

    var data = this.taskGroup.getRawValue();
    const startDate = new Date(data.startdate).toISOString().split('T')[0];
    const estimateDate = new Date(data.estimate).toISOString().split('T')[0];

    var dt = {
      title: data.title,
      status: "Open",
      summary: data.summary,
      kanban_type: data.type,
      priority: data.priority,
      tags: data.tags,
      assignee: data.assignee,
      rankid: 1,
      color: "#238823",
      estimate: Number(data.estimate),
      estimatedate: estimateDate,
      className: "class",
      updatedate: estimateDate,
      updateuser: "mstoews",
      startdate: startDate
    }

    this.onClose();
  }


  private assignType(task: IKanban): string {
    if (task.kanban_type !== null && task.kanban_type !== undefined) {
      const type = this.types().find((x) => x.type === task.kanban_type.toString());
      if (type === undefined) {
        this.cType = 'Add';
      } else {
        this.cType = type.type;
      }
    } else {
      this.cType = 'Add';
    }
    return this.cType;
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
    if (this.priority !== undefined) {
      const priority = this.priority().find(
        (x) => x.priority === task.priority.toString()
      );
      if (priority !== undefined) {
        this.cPriority = priority.priority;
      } else {
        this.cPriority = 'Normal';
      }
    } else {
      this.cPriority = 'Normal';
    }
    return this.cPriority
  }
}
