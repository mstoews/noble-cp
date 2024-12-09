import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ChangeDetectorRef, Inject, Optional } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IKanbanTask } from '../kanban-card/kanban-form/kanban.task.form';
import { KanbanService } from '../module/kanban.service';


@Component({
  selector: 'app-kanban-comments',
  templateUrl: './kanban-comments.component.html',
  styleUrls: ['./kanban-comments.component.scss']
})
export class KanbanCommentsComponent implements OnInit {

  taskGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<KanbanCommentsComponent>,
              private fb: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              public kanbanService: KanbanService,
              @Optional() @Inject(MAT_DIALOG_DATA) public task: IKanbanTask) { }

  ngOnInit(): void {
  }
}
