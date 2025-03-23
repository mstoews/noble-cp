import { Component, OnInit, inject, viewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MaterialModule } from 'app/shared/material.module';
import { EditService, FilterService, GridComponent, GridModule, PageService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Store } from '@ngrx/store';
import { GridMenubarStandaloneComponent } from '../accounting/grid-components/grid-menubar.component';
import { projectFeature } from 'app/state/kanban-state/projects/projects.state';
import { ToastrService } from 'ngx-toastr';

import { projectsPageActions } from 'app/state/kanban-state/projects/actions/projects-page.actions';
import { GLGridComponent } from '../accounting/grid-components/gl-grid.component';
import { IProjects } from 'app/models/kanban';

import {
    ContextMenuComponent,
    ContextMenuModule,
    MenuEventArgs,
    MenuItemModel,
} from "@syncfusion/ej2-angular-navigations";



const imports = [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    GridMenubarStandaloneComponent,
    GLGridComponent,
    ContextMenuModule
];

@Component({
    selector: 'kb-projects',
    imports: [imports],
    template: `
        <mat-drawer class="lg:w-1/3 sm:w-full bg-white-100" #drawer [opened]="false" mode="over" [position]="'end'"  [disableClose]="false">
            <mat-card class="m-2 p-2 mat-elevation-z8">
                    <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
                        <div class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600" mat-dialog-title> {{ sTitle }} </div>
                        <div mat-dialog-content>
                        <form [formGroup]="projectsForm">
                            <div class="flex flex-col m-1">
                                
                                <div class="flex flex-col grow">
                                
                                    <mat-form-field class="flex-auto  grow">
                                            <mat-label class="text-md ml-2  dark:text-gray-200">Project</mat-label>
                                            <input matInput placeholder="Name" formControlName="name"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                    </mat-form-field>
                                    
                                    <mat-form-field class="flex-auto  grow">
                                            <mat-label class="text-md ml-2">Start Date</mat-label>
                                            <input matInput formControlName="start_date" [matDatepicker]="picker_start"
                                                [placeholder]="'Start Date'">
                                            <mat-datepicker-toggle matIconPrefix [for]="picker_start"></mat-datepicker-toggle>
                                            <mat-datepicker #picker_start></mat-datepicker>
                                    </mat-form-field>
                                                                    
                                    <mat-form-field class="flex-auto grow">
                                            <mat-label class="text-md ml-2">Forecast End Date</mat-label>
                                            <input matInput formControlName="forecast_end_date" [matDatepicker]="picker_end" [placeholder]="'Forecast End Date'">
                                            <mat-datepicker-toggle matIconPrefix [for]="picker_end"></mat-datepicker-toggle>
                                            <mat-datepicker #picker_end></mat-datepicker>
                                    </mat-form-field>
                                                                        
                                    <mat-form-field class="flex-auto  grow">
                                            <mat-label class="ml-2 text-base dark:text-gray-200">Description</mat-label>
                                            <input matInput placeholder="Description" formControlName="description"/>
                                            <mat-icon class="icon-size-5" matPrefix [svgIcon]="'heroicons_solid:document'"></mat-icon>
                                        </mat-form-field>
                                    </div>
                                    
                            </div>
                        </form>
                        </div>
                    </div>
                    <div mat-dialog-actions class="gap-2 mb-3">
                        @if (bDirty === true) {
                            <button mat-icon-button color="primary" class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()" matTooltip="Save" aria-label="hovered over">
                                <span class="e-icons e-save"></span>
                            </button>
                        }
                        <button mat-icon-button color="primary" class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over"> 
                            <span class="e-icons e-circle-add"></span>
                        </button>

                        <button mat-icon-button color="primary" class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete" aria-label="hovered over"> 
                            <span class="e-icons e-trash"></span>
                        </button>

                        <button mat-icon-button color="primary" class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close" aria-label="hovered over">
                            <span class="e-icons e-circle-close"></span>
                        </button>                    

                    </div>
            </mat-card> 
        </mat-drawer>

        <mat-drawer-container class="flex-col h-full">              
            <ng-container >
                <grid-menubar [inTitle]="sTitle" [showNew]=true [showSettings]=false (newRecord)="onAdd()"></grid-menubar>        

                @if ((isLoading$ | async) === false)  {            
                    @if (projects$ | async; as projects ) {            
                        <gl-grid id="target" (onUpdateSelection)="onSelection($event)" [data]="projects" [columns]="columns"> </gl-grid>            
                    }
                }
                
            </ng-container>
        </mat-drawer-container>

        <ejs-contextmenu 
                #contextmenu id='contextmenu'             
                target='#target' 
                (select)="itemSelect($event)"
                [animationSettings]='animation'
                [items]= 'menuItems'> 
         </ejs-contextmenu> 
    `,
    providers: [
        SortService,
        PageService,
        FilterService,
        ToolbarService,
        EditService,
    ],
})
export class ProjectComponent implements OnInit {

    private confirmation = inject(FuseConfirmationService);
    public sTitle = 'Project Management';

    public drawer = viewChild<MatDrawer>('drawer');
    public grid = viewChild<GridComponent>('grid');

    // Form Group    
    public bDirty = false;

    public contextmenu: ContextMenuComponent;
    public animation = {
        effect: 'FadeIn',
        duration: 800
    };

    projectsForm = new FormGroup({
        project_ref: new FormControl(0),
        name: new FormControl('', [Validators.required]),
        start_date: new FormControl('', [Validators.required]),
        forecast_end_date: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        create_date: new FormControl(''),
        create_user: new FormControl(''),
    });

    store = inject(Store);
    projects$ = this.store.select(projectFeature.selectProjects);
    isLoading$ = this.store.select(projectFeature.selectIsLoading);
    selectedTypes$ = this.store.select(projectFeature.selectSelectedProject);

    toast = inject(ToastrService);

    public columns = [
        { field: 'project_ref', headerText: 'Project ID', width: 80, textAlign: 'Left', isPrimaryKey: true },
        { field: 'name', headerText: 'Name', width: 200, textAlign: 'Left' },
        { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
        { field: 'start_date', headerText: 'Start Date', width: 80, textAlign: 'Left' },
        { field: 'forecast_end_date', headerText: 'Forecast End Date', width: 80, textAlign: 'Left' },
        { field: 'create_date', headerText: 'Create Date', width: 80, textAlign: 'Left' },
        { field: 'create_user', headerText: 'Create User', width: 80, textAlign: 'Left' }
    ];

    public ngOnInit() {
        this.onChanges();
        this.store.dispatch(projectsPageActions.load());
    }

    public onSelection(data: IProjects) {
        const dDate = new Date();
        const startDate = new Date(data.start_date).toISOString().split('T')[0];
        const finishDate = new Date(data.forecast_end_date).toISOString().split('T')[0];
        const updateDate = dDate.toISOString().split('T')[0];
        this.bDirty = false;
        this.projectsForm.patchValue({
            project_ref: data.project_ref,
            name: data.name,
            description: data.description,
            start_date: startDate,
            forecast_end_date: finishDate,
            create_date: updateDate,
            create_user: data.create_user
        });
        this.openDrawer();
    }


    public onChanges(): void {

        this.projectsForm.valueChanges.subscribe(value => {
            this.bDirty = true;
            return;
        });

        this.bDirty = true;
    }


    public onAdd() {
        const updateDate = new Date().toISOString().split('T')[0];
        const project = this.projectsForm.value;
        const update: IProjects = {
            project_ref: project.project_ref,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            forecast_end_date: project.forecast_end_date,
            create_date: updateDate,
            create_user: project.create_user
        }

        this.store.dispatch(projectsPageActions.add({ project: update }));
        this.bDirty = false;
        this.toast.success('Project Added', 'Success');
        this.closeDrawer();
    }

    public onAddNew() {
        this.projectsForm.reset();
        this.toast.success('Add a new project', 'Success');
        this.openDrawer();
    }

    public onCancel() {
        this.closeDrawer();
    }

    public onClone() {
        const project = this.projectsForm.value;

    }

    public onDelete() {

        const data = this.projectsForm.value as IProjects;

        const confirmation = this.confirmation.open({
            title: 'Delete Fund?',
            message: `Are you sure you want to delete the fund: ${data.name}`,
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.store.dispatch(projectsPageActions.delete({ project: data }));
                this.toast.success(`Project ${data.name} has been deleted`, 'Success');
            }
        });
        this.closeDrawer();
    }


    public onUpdate() {
        const project = this.projectsForm.value;
        const updateDate = new Date().toISOString().split('T')[0];
        const update: IProjects = {
            project_ref: project.project_ref,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            forecast_end_date: project.forecast_end_date,
            create_date: updateDate,
            create_user: project.create_user
        }
        this.store.dispatch(projectsPageActions.update({ project: update }));
        // this.bDirty = false;
        this.toast.success(`Project ${project.name} has been updated`, 'Success');
        this.closeDrawer();
    }

    public openDrawer() {
        const opened = this.drawer().opened;
        if (opened !== true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    public closeDrawer() {
        const opened = this.drawer().opened;
        if (opened === true) {
            this.drawer().toggle();
        } else {
            return;
        }
    }

    public menuItems: MenuItemModel[] = [
        { id: 'Edit', text: 'Update Account', iconCss: 'e-icons e-edit-2' },
        { id: 'Create', text: 'Create Account', iconCss: 'e-icons e-circle-add' },
        { id: 'Copy', text: 'Clone Account', iconCss: 'e-icons e-copy' },
        { id: 'Delete', text: 'Deactivate Account', iconCss: 'e-icons e-delete-1' },
        {
            separator: true
        },
        { id: 'Settings', text: 'Settings', iconCss: 'e-icons e-settings' },

    ];

    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.id) {
            case 'Edit':
                this.onUpdate();
                break;
            case 'Create':
                this.onAddNew()
                break;
            case 'Clone':
                this.onClone();
                break;
            case 'Delete':
                this.onDelete();
                break;
            case 'Settings':
                this.onOpenSettings();
                break;
        }
    }

    public onOpenSettings() {
        this.toast.info('Settings', 'Not Implemented');
    }

    @HostListener("window:exit")
    public exit() {
        if (this.bDirty === true) {
            const confirm = this.confirmation.open({
                title: 'Fund Modified',
                message: 'Are you sure you want to exit without saving? ',
                actions: {
                    confirm: {
                        label: 'Confirm',
                    },
                },
            });

            confirm.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this.closeDrawer();
                    this.projectsForm.reset();
                }
            });
        } else {
            return;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.adjustHeight();
    }

    ngAfterViewInit() {
        this.adjustHeight();
    }

    adjustHeight() {
        if (this.grid()) {
            this.grid().height = (window.innerHeight - 450) + 'px'; // Adjust as needed
        }
    }

}
