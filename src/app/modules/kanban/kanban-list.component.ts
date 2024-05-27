import {
  AbstractControl,
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
import { KanbanService } from 'app/services/kanban.service';
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
onCopy() {
throw new Error('Method not implemented.');
}
  public data: any;

  private _fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);

  private kanbanService = inject(KanbanService);
  @ViewChild('drawer') drawer!: MatDrawer;

  public sTitle = 'Kanban List';
  public taskGroup!: FormGroup;
  public data$: any
  tasksList = this.kanbanService.read()
rag: any;
types: any;
priorities: any;
assignees: any;
bAdding: any;
  
  ngOnInit() {      
    this.createEmptyForm();
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
              // Delete the list
              // this.typeApiService.delete(this.typeId);
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

  onUpdate(e: any) {
      const dDate = new Date();
      // const updateDate = dDate.toISOString().split('T')[0];
      // const account = { ...this.accountsForm.value } as IKanban;
      // const rawData = {
      //     type: account.type,
      //     description: account.description,
      //     update_date: updateDate,
      //     update_user: 'admin_update',
      // };

      this.closeDrawer();
  }

    onRefresh() {
        this.tasksList = this.kanbanService.read()
    }

    onCellDblClick(e: any) {
        console.debug('on cell form double click ', e.data)
        this.openDrawer()
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

