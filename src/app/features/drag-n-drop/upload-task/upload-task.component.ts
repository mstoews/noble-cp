import { Component, OnInit, Input, ChangeDetectorRef, inject } from '@angular/core'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
} from 'firebase/storage'

import { Observable, of } from 'rxjs'

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { tap } from 'rxjs/operators'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { CommonModule } from '@angular/common'
import { DndDirective } from '../loaddnd/dnd.directive'
import { STORAGE } from 'app/app.config'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DndDirective,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  selector: 'upload-image',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent {
  public file: any = {};

  percentage: any
  snapshot: Observable<UploadTaskSnapshot> | undefined
  downloadURL!: string

  private storage = inject(STORAGE);

  constructor() {
    this.percentage = of(0)
  }

  chooseFile(event: any) {
    this.file = event.target.files[0]
  }

  addData() {
    const storageRef = ref(this.storage, this.file.name)
    const uploadTask = uploadBytesResumable(storageRef, this.file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // console.debug('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            // console.debug('Upload is paused');
            break
          case 'running':
            // console.debug('Upload is running');
            break
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.debug('File available at', downloadURL);
        })
      }
    )
  }
}
