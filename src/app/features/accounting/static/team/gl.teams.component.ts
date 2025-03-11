import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModule } from 'app/services/material.module';
import { AggregateService, ColumnMenuService, DialogEditEventArgs, EditService, FilterService, FilterSettingsModel, GridModule, GroupService, PageService, ResizeService, SaveEventArgs, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IAccounts } from 'app/models';
import { TeamStore } from 'app/services/teams.store';
import { ITeam } from 'app/models/team';
import { TeamService } from 'app/services/team.service';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { Validation } from '@syncfusion/ej2-angular-spreadsheet';



const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent,
    GLGridComponent
];

interface IValue {
    value: string;
    viewValue: string;
}


@Component({
    template: `
  <div class="h-[calc(100vh)-100px] ">
    
    <mat-drawer class="w-[450px]" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
        <mat-card class="m-2">
            <div class="flex flex-row w-full filter-article filter-interactive text-gray-700">
                <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400 grow w-full"
                    mat-dialog-title>
                    {{ title }}
                </div>
            </div>

            <form [formGroup]="teamForm" class="form">
                <div class="div flex flex-col grow">
                    <section class="flex flex-col md:flex-col m-1">

                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                
                                <input #myInput matInput placeholder="Title" formControlName="title" />
                                    <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'mat_outline:title'"></mat-icon>
                            </mat-form-field>
                        </div>
  
                        <!-- Member -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                        
                                <input matInput placeholder="Member" formControlName="team_member" />
                                <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'heroicons_outline:user-circle'"></mat-icon>
                            </mat-form-field>
                        </div>
                        
                        <!-- First Name -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                    
                                <input matInput placeholder="First Name" formControlName="first_name"> 
                                <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'heroicons_outline:user-plus'"></mat-icon>
                            </mat-form-field>
                        </div>

                        <!-- Last Name -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                
                                <input #myInput matInput placeholder="Last Name" formControlName="last_name" />
                                    <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'heroicons_outline:user-plus'"></mat-icon>
                            </mat-form-field>
                        </div>
                         
                        <!-- location -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                
                                <input #myInput matInput placeholder="Location" formControlName="location" />
                                    <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'mat_outline:my_location'"></mat-icon>
                            </mat-form-field>
                        </div>
                      
                        <!-- email -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                
                                <input #myInput matInput placeholder="Mail" formControlName="email" type="email"/>
                                    <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'mat_outline:email'"></mat-icon>
                            </mat-form-field>
                        </div>

                        <!-- role -->
                        <div class="flex flex-col grow">
                            <mat-form-field class="m-1 flex-start">                                
                                <input #myInput matInput placeholder="Role" formControlName="role" type="role"/>
                                    <mat-icon class="icon-size-5 text-teal-800" matPrefix [svgIcon]="'mat_outline:supervised_user_circle'"></mat-icon>
                            </mat-form-field>
                        </div>
                    
                    </section>
                </div>
            </form>
            
                <div class="flex flex-row w-full">
                    @if (bDirty === true) {
                    <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdateJournalEntry()"
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
                            class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                            aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                    </button>   
                </div>
            
            <section class="text-xl text-gray-700" [formGroup]="teamForm">                        
                {{store.team() | json}}  
            </section>
        </mat-card>
    </mat-drawer>
    <mat-drawer-container class="flex-col">        
        <ng-container>
            <grid-menubar 
                [inTitle]="'Team Members'"
                (notifyParentRefresh)="onRefresh()" 
                (notifyParentAdd)="onAdd()"
                (notifyParentDelete)="onDeleteSelection()" 
                (notifyParentUpdate)="onUpdateSelection()">
             </grid-menubar>                         
             
            @if (store.isLoading() === false) 
            {                            
                <gl-grid 
                    (onUpdateSelection)="selectedRow($event)"
                    [data]="store.team()"
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
    </mat-drawer-container>
    </div>
  `,
    selector: 'team',
    imports: [imports],
    providers: [TeamStore, SortService, GroupService, PageService, ResizeService, FilterService, ToolbarService, EditService, AggregateService, ColumnMenuService]
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

    public bDirty = false;

    store = inject(TeamStore);
    title = "Team Maintenance"

    columns = [
        { field: 'team_member', headerText: 'Team Member', width: 100, isPrimaryKey: true },
        { field: 'first_name', headerText: 'First Name', width: 100 },
        { field: 'last_name', headerText: 'Last Name', width: 100 },
        { field: 'location', headerText: 'Location', width: 100 },
        { field: 'title', headerText: 'Title', width: 100 },
        { field: 'updatedte', headerText: 'Updated', width: 100 },
        { field: 'updateusr', headerText: 'Updated By', width: 100 },
        { field: 'email', headerText: 'Email', width: 100 },
        { field: 'image', headerText: 'Image', width: 100 },
        { field: 'uid', headerText: 'UID', width: 100 }
    ];

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
        this.pageSettings = { pageSizes: true, pageCount: 10 };
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
    }

    public onCancel() {
        this.closeDrawer();
    }

    selectedRow(team: ITeam) {
        this.teamForm.patchValue(team);
        this.openDrawer();
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

    onFocusedRowChanged(event: any) { }

    onCreate(e: any) {
        this.createEmptyForm();
        this.openDrawer();
    }

    onDelete() { }


    createEmptyForm() {
        this.teamForm = this.fb.group({
            team_member: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            location: ['', Validators.required],
            title: ['', Validators.required],
            updatedte: ['', Validators.required],
            updateusr: ['', Validators.required],
            email: ['', Validators.required],
            image: ['', Validators.required],
            uid: ['', Validators.required]
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
            team_member: team.team_member,
            first_name: team.first_name,
            last_name: team.last_name,
            location: team.location,
            title: team.title,
            updatedte: team.updatedte,
            updateusr: team.updateusr,
            email: team.email,
            image: team.image,
            uid: team.uid
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
