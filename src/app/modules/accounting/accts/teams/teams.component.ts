import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-menubar/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { KanbanMenubarComponent } from 'app/modules/reporting/reporting-menubar/grid-menubar.component';
import { KanbanStore } from 'app/modules/kanban/kanban.store';
import { AggregateService, ColumnMenuService, DialogEditEventArgs, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SaveEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IAccounts } from 'app/models/journals';
import { TeamStore } from 'app/services/teams.store';
import { ITeam } from 'app/models/team';
import { TeamService } from 'app/services/team.service';



const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  GridModule,
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
  providers: [TeamStore, SortService, GroupService ,PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService]
})
export class TeamsComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnInit() { 
    this.initialDatagrid()
    this.createEmptyForm(); 
  }

  
  private fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  teamService = inject(TeamService);
  
  teamStore = inject(TeamStore);  
  title = "Team Maintenance"
  
  public teamForm!: FormGroup;

  public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    
    
    initialDatagrid() {
        // this.pageSettings = { pageCount: 10 };        
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }        
        this.pageSettings =  { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };              
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent:true };
        this.toolbarOptions = ['Search'];   
        this.filterSettings = { type: 'Excel' };    
    }



    actionBegin(args: SaveEventArgs): void {        
        var data = args.rowData as IAccounts;
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {        
           this.openDrawer();        
                        
        }
        if (args.requestType === 'save') {
            args.cancel = true;
            console.log(JSON.stringify(args.data));
            var data = args.data as IAccounts;                        
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


  
  
  onDeleteCurrentSelection() { }

  onUpdateCurrentSelection() { }
  
  onFocusedRowChanged(event: any ) { }

  onCreate(e: any) {
      this.createEmptyForm();
      this.openDrawer();
  }

  onDelete() { }


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
