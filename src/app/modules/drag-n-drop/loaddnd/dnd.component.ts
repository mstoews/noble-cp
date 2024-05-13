import { CommonModule } from '@angular/common';
import { Component, ViewChild, Inject, Optional, inject, OnDestroy, } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Observable, Subject, map, of, } from 'rxjs';
import { ProgressComponent } from '../progress/progress.component';
import { DndDirective } from './dnd.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { STORAGE } from 'app/app.config';


import { EvidenceService, IEvidence } from 'app/services/evidence.service';
import { DateTime } from 'luxon';
import { MaterialModule } from 'app/services/material.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ProgressComponent,
    DndDirective,
    ReactiveFormsModule,
    MaterialModule,
  ],
  selector: 'image-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss'],
})
export class DndComponent implements OnDestroy {
  subAllImages: any;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DndComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public imageData: any
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
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {

        const updateDate = DateTime.now().toFormat('yyyy-MM-dd');

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {          
          const update = {
          "journal_id": this.imageData.journal_id, 
          "reference": this.imageData.reference_no.toString(), 
          "description": this.imageData.description,
          "location": downloadURL,
          "user_created": "admin",
          "date_created": updateDate }
          console.debug(update);        
          this.evidenceService.createEvidence(update);
          this.closeDialog();
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
