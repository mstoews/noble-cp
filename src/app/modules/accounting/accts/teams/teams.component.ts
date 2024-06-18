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
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';

import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { KanbanMenubarComponent } from 'app/modules/reporting/reporting-menubar/grid-menubar.component';
import { KanbanStore } from 'app/modules/kanban/kanban.store';
import { ITeam, KanbanService } from 'app/modules/kanban/kanban.service';


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
  selector: 'team',
  standalone: true,
  imports: [imports],
  templateUrl: './teams.component.html',
  styles: `::ng-deep .dx-datagrid .dx-datagrid-rowsview .dx-row-focused.dx-data-row:not(.dx-edit-row) > td:not(.dx-focused) {
      background-color: rgb(195, 199, 199);
      border-color: #ada6a7;
      }`,
  providers: []
})
export class TeamsComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;
  
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  
  kanbanService = inject(KanbanService);
  
  title = "Team Maintenance"
  
  public teamForm!: FormGroup;
  
  ngOnInit() {      
      this.createEmptyForm();
  }

  onDoubleClicked(event) {

  }

  onDeleteCurrentSelection() {

  }

  onUpdateCurrentSelection() {

  }
  
  onFocusedRowChanged(e ) {

  }

  onCreate(e: any) {
      this.createEmptyForm();
      this.openDrawer();
  }

  onDelete() {
    
  }


  createEmptyForm() {
      this.teamForm = this.fb.group({
            team_member :   [''],
            first_name  :   [''],
            last_name   :   [''],
            location    :   [''],
            title       :   [''],
            updatedte   :   [''],
            updateusr   :   [''],
            email       :   [''],
            image       :   [''],
            uid         :   ['']
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
      const updateDate = dDate.toISOString().split('T')[0];
      const team = { ...this.teamForm.value } as ITeam;
      const rawData = {
        team_member :   team.team_member,
        first_name  :   team.first_name,
        last_name   :   team.last_name,
        location    :   team.location,
        title       :   team.title,
        updatedte   :   team.updatedte,
        updateusr   :   team.updateusr,
        email       :   team.email,
        image       :   team.image,
        uid         :   team.uid          
      };
   }

    onRefresh() {
      throw new Error('Method not implemented.');
    }
    onAdd() {
      throw new Error('Method not implemented.');
    }
        
    onDeleteSelection() {
      throw new Error('Method not implemented.');
    }
    
    onUpdateSelection() {
      throw new Error('Method not implemented.');
    }
    

}
