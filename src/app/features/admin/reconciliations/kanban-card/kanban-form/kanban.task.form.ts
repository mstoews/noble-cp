import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    Optional,
} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { KanbanService } from '../../module/kanban.service';

interface IValue {
    value: string;
    viewValue: string;
}

interface IType {
    type: string;
    description: string;
    updatedte: Date;
    updateusr: string;
}

interface IPriority {
    priority: string;
    description: string;
    updatedte: Date;
    updateusr: string;
}

export interface IKanbanTask {
    task_id: string;
    party_ref: string;
    title: string;
    status: string;
    summary: string;
    type: IType[];
    priority: IPriority[];
    tags: string;
    estimate: number;
    assignee: string;
    rankid: number;
    color: IValue[];
    classname: string;
    description: string;
    due_date: Date;
    start_date: Date;
    dependencies: string;
}

@Component({
    selector: 'app-task-form',
    templateUrl: './kanban.task.form.html',
})
export class KanbanTaskFormComponent implements OnInit {

    taskGroup: FormGroup;
    action: string;
    // tslint:disable-next-line: variable-name
    party: string;
    sTitle: string;
    cPriority: string;
    cRAG: string;
    cType: string;
    currentDate: Date;
    @Input() colorCode: string;

    KbPriority: IPriority[];
    subType: Subscription;
    subPriority: Subscription;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    types: IValue[] = [
        { value: 'add', viewValue: 'ADD' },
        { value: 'update', viewValue: 'UPDATE' },
        { value: 'delete', viewValue: 'REMOVE' },
        { value: 'verify', viewValue: 'VERIFY' },
    ];

    rag: IValue[] = [
        { value: '#238823', viewValue: 'GREEN' },
        { value: '#FFBF00', viewValue: 'AMBER' },
        { value: '#D2222D', viewValue: 'RED' },
    ];

    priority: IValue[] = [
        { value: 'Critical', viewValue: 'CRITICAL' },
        { value: 'High', viewValue: 'HIGH' },
        { value: 'Medium', viewValue: 'MEDIUM' },
        { value: 'Low', viewValue: 'LOW' },
    ];

    team: IValue[] = [
        { value: '@ashley', viewValue: '@ashley' },
        { value: '@hiroshi', viewValue: '@hiroshi' },
        { value: '@kasi', viewValue: '@kasi' },
        { value: '@arun', viewValue: '@arun' },
    ];

    constructor(
        public dialogRef: MatDialogRef<KanbanTaskFormComponent>,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        public kanbanService: KanbanService,
        @Optional() @Inject(MAT_DIALOG_DATA) public task: IKanbanTask
    ) {
        this.createForm(task);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    isOverdue(): boolean {
        return moment(this.task.due_date, moment.ISO_8601).isBefore(moment(), 'days');
    }

    changePriority(data) {
        this.cPriority = data;
        console.log(`Priority value changed : ${data}`);
    }

    changeRag(data) {
        this.cRAG = data;
        console.log(`RAG value changed : ${data}`);
    }

    changeType(type) {
        this.cType = type;
        console.log(`TYPE value changed : ${type}`);
    }

    ngOnInit() {
        this.updatePriorityData();
        this.taskGroup.valueChanges
        .subscribe((value) => {
            console.log(`Value changed  ${value}, ${value.id}`);
            this.changeDetectorRef.markForCheck();
        });

    }

    OnDestroy() {
        this.subType.unsubscribe();
        this.subPriority.unsubscribe();
    }

    updatePriorityData() {
        this.subPriority = this.kanbanService
            .getKanbanPriorities()
            .subscribe(priority => (this.KbPriority = priority));
    }

    createForm(task: IKanbanTask) {
        this.sTitle = 'Kanban Task - ' + task.task_id;

        const dDate = new Date(task.due_date);
        const dueDate = dDate.toISOString().split('T')[0];

        const sDate = new Date(task.start_date);
        const startDate = sDate.toISOString().split('T')[0];
        const pr = this.priority.find(
            x => x.value === task.priority.toString()
        );
        const rag = this.rag.find(x => x.value === task.color.toString());
        const types = this.types.find(x => x.value === task.type.toString());

        if (pr === undefined) {
            this.cPriority = 'MEDIUM';
        } else {
            this.cPriority = pr.value;
        }

        if (rag === undefined) {
            this.cRAG = '#238823';
        } else {
            this.cRAG = rag.value;
        }

        if (types === undefined) {
            this.cType = 'add';
        } else {
            this.cType = types.value;
        }

        console.log(
            `Current ranked iD : ${task.rankid} due Date : ${dueDate}`
        );

        console.log(
            `Current ranked iD : ${task.rankid} start Date : ${startDate}`
        );


        this.taskGroup = this.fb.group({
            task_id: [task.task_id],
            party_ref: [task.party_ref],
            title: [task.title],
            status: [task.status],
            summary: [task.summary],
            type: [this.cType],
            priority: [this.cPriority],
            tags: [task.tags],
            estimate: [task.estimate],
            assignee: [task.assignee],
            rankid: [task.rankid],
            color: [this.cRAG],
            description: [task.description],
            due_date: [dueDate],
            start_date: [startDate],
            dependencies: [task.dependencies],
        });
    }

    onCreate(data) {
        data = this.taskGroup.getRawValue();
        this.dialogRef.close({ event: 'Create', data });
    }

    onUpdate(data) {
        data = this.taskGroup.getRawValue();
        this.dialogRef.close({ event: 'Update', data });
    }

    onDelete(data) {
        data = this.taskGroup.getRawValue();
        this.dialogRef.close({ event: 'Delete', data });
    }

    onAddComment(data) {
        console.log(`${data}`);
    }

    onAssignment(data) {
        console.log(`${data}`);
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
