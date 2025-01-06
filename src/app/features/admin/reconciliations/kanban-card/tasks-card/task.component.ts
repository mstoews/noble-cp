import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ITask } from '../../module/tasks.model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { KanbanService } from '../../module/kanban.service';
import { PartyRefService } from 'app/services/partyRef.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() item: ITask;
  @Input() title: string;
  @Output() private notifyOpenTaskDialog: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog,
              public partyRefService: PartyRefService,
              private kanbanService: KanbanService) {
  }



  ngOnInit(): void {}

  openMenu(): void {
    console.log('Open Type');
  }

  onCardClick(event){
    console.log(`open the edit dialog : ${event.summary}`);
  }

  updateData(partyRef: string) {
    // let party!: PartyRefService;
    // party.clientRef = '';
    // party.partyRef = partyRef;
    // party.partyType = this.inPartyType;
    // this.kanbanService.setParty(partyRef);
  }

  onAdd(data) {
    console.log('OnAdd from KanbanTasks');
    this.notifyOpenTaskDialog.emit(data);
  }
}
