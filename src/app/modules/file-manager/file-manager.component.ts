import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';

import { DndComponent } from 'app/modules/drag-n-drop/loaddnd/dnd.component';
import { EvidenceService } from 'app/services/evidence.service';
import { EvidenceCardComponent } from './file-manager-card/evidence-card.component';
import { GridMenubarStandaloneComponent } from '../accounting/grid-menubar/grid-menubar.component';
import { MaterialModule } from 'app/services/material.module';
import { GridModule } from '@syncfusion/ej2-angular-grids';

const imports = [
  CommonModule,
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  EvidenceCardComponent,
  GridMenubarStandaloneComponent,
  GridModule
];

@Component({
    selector: 'app-file-manager',
    imports: [imports],
    templateUrl: './file-manager.component.html'
})

export class FileManagerComponent {

  private fb = inject(FormBuilder);
  private evidenceServer = inject(EvidenceService);


  @ViewChild('drawer') drawer!: MatDrawer;
  collapsed = false;
  sTitle = 'File Management';
  selectedItemKeys: any[] = [];

  evidence$ = this.evidenceServer.readEvidence();

  onRefresh() { }
  onAdd() { }
  onUpdateSelection() { }
  onDeleteSelection() { }



  drawOpen: 'open' | 'close' = 'open';

  customizeTooltip = (pointsInfo: { originalValue: string; }) => ({ text: `${parseInt(pointsInfo.originalValue)}%` });
  evidenceForm!: FormGroup;

  keyField: any;
  accountsForm!: FormGroup;

  async ngOnInit() {
    this.createEmptyForm();
    // await this.updateBooked()
  }

  openDocument(e: any) {
    console.debug(e);
  }


  onDelete($event: any) {
    throw new Error('Method not implemented.');
  }

  onUpdate($event: any) {
    throw new Error('Method not implemented.');
  }

  createEmptyForm() {
    this.evidenceForm = this.fb.group({
      journal_id: [''],
      reference_no: [''],
      description: [''],
      location: [''],
      create_date: [''],
      create_user: [''],
    });
  }

  onCreate() {
    this.createEmptyForm();
    this.openDrawer();
  }


  selectionChanged(data: any) {
    console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoubleClicked(e: any) {
    this.evidenceForm = this.fb.group({
      reference_no: [e.data.reference_no],
      description: [e.data.description],
      location: [e.data.location]
    });
    this.openDrawer();
  }

  onFocusedRowChanged(e: any) {
    console.debug(`selectionChanged ${JSON.stringify(e.data)}`);
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

}
