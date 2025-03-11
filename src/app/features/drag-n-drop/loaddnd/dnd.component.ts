import { CommonModule } from '@angular/common';
import { Component, ViewChild, Inject, Optional, inject, OnDestroy, } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Observable, Subject, map, of, } from 'rxjs';
import { ProgressComponent } from '../progress/progress.component';

import { ReactiveFormsModule } from '@angular/forms';
import { STORAGE } from 'app/app.config';


import { EvidenceService } from 'app/services/evidence.service';
import { DateTime } from 'luxon';
import { MaterialModule } from 'app/services/material.module';
import { DndDirective } from './dnd.directive';
import { IArtifacts } from 'app/models/journals';

@Component({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    selector: 'image-dnd',
    standalone: true,
    template: `
    <div class="bg-slate-50">
        <div class="flex">
          <img class="flex-none w-10 h-10 p-2" src='assets/img/dnd/ic-upload-file.svg' alt="dnd">
          <span class="flex-1 text-3xl text-black mt-1">Transaction Evidence</span>
        </div>
        <div mat-dialog-content>
          <form [formGroup]="formGroup" #myForm="ngForm">
            <div class="container" appDnd (fileDropped)="onFileDropped($event)">
              <input type="file" #fileDropRef id="fileDropRef" multiple (change)="fileBrowseHandler($event)" />
              <div class="text-black">Drag and drop file here</div>
              <div>or</div>
              <label for="fileDropRef">Browse for file</label>
            </div>
            <div class="files-list">
              @for (file of files; track file; let i = $index) {
              <div class="single-file">
                <img class="flex-none w-8 h-8 p-1" src='assets/img/dnd/ic-file.svg' alt="dnd">
                <div class="info">
                  <div class="name">
                    {{ file?.name }}
                  </div>
                  <div class="size">
                    {{ formatBytes(file?.size) }}
                  </div>
                  @if ((percentageChange$ | async); as percentage) {
                  <div>
                    <mat-progress-bar class="progress-bar" mode="determinate" [value]="percentage">
                    </mat-progress-bar>
                    <span>{{percentage / 100 | percent}}</span>
                  </div>
                  }
                </div>
                <img src="assets/img/dnd/ic-delete-file.svg" class="w-8 h-8" width="20px" alt="file" (click)="deleteFile(i)">
              </div>
              }
            </div>
          </form>
            
          <button mat-icon-button color="primary" class="mr-1 bg-gray-100" (click)="onCreate()" matTooltip="Update"
            aria-label="Update">
            <mat-icon [svgIcon]="'mat_outline:system_update'"></mat-icon>
          </button>
            
          <button mat-icon-button color="primary" class="mr-1 bg-gray-100" (click)="closeDialog()" matTooltip="Close"
            aria-label="Amend">
            <mat-icon [svgIcon]="'mat_outline:close'"></mat-icon>
          </button>            
        </div>            
</div>
    `,
    styleUrls: ['./dnd.component.scss']
})
export class DndComponent implements OnDestroy {
  subAllImages: any;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DndComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public imageData: IArtifacts
  ) {
    this.createForm();
  }

  private storage = inject(STORAGE);
  private evidenceService = inject(EvidenceService)
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  @ViewChild('fileDropRef', { static: false })
  downloadUrl: Observable<string | null>;

  files: any[] = [];
  upLoadFiles: File[] = [];
  formGroup!: FormGroup;
  percentageChange$: Observable<number | undefined>;

  createForm() {
    this.formGroup = this.fb.group({});
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler($event: any) {
    this.prepareFilesList($event.target.files);
  }

  prepareFilesList(files: any) {
    for (const item of files) {
      this.upLoadFiles.push(item);
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      // console.debug('delete files ');
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFileProgress(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFileProgress(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
  }

  async startUpload(file: File, imageDt: any) {

    const location = '/documents/';
    const path = location + file.name;
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.percentageChange$ = of(progress);
        console.debug('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.debug('Upload is paused');
            break;
          case 'running':
            console.debug('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },() => {
              const updateDate = DateTime.now().toFormat('yyyy-MM-dd');

              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const update = {
                  journal_id: this.imageData.journal_id,
                  reference: this.imageData.reference,
                  description: this.imageData.description,
                  location: downloadURL,
                  user_created: this.imageData.user_created,
                  date_created: updateDate
                }                                                     
                return update;
              });
            }
    );
  
  }

  async onCreate() {
    let data = this.imageData;
    for (const item of this.upLoadFiles) {
      await this.startUpload(item, data);
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ngOnDestroy(): void {
    if (this.subAllImages != null) {
      this.subAllImages.unsubscribe();
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
