import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { UploadTask, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProgressComponent } from './progress/progress.component';

import { FIRESTORE, STORAGE } from 'app/app.config';

@Component({
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, ReactiveFormsModule, FormsModule
  ],
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.scss']
})
export class DragNDropComponent {
  public readonly downloadUrl$!: Observable<string>;
  @Input() file!: File;
  uploadPercent!: Observable<any>;
  percentage!: Observable<number>;

  private storage = inject(STORAGE);

  async uploadFile() {
    if (this.file) {
      try {
        const storageRef = ref(this.storage, this.file.name);
        const task = uploadBytesResumable(storageRef, this.file);
        await task;
        const url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      // handle invalid file
    }
  }
}

const TRANSPARENT_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

