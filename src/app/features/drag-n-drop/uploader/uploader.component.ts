import { Component } from '@angular/core';
import { DragNDropComponent } from '../drag-n-drop.component';
import { DndDirective } from '../loaddnd/dnd.directive';

@Component({
  standalone: true,
  imports: [DragNDropComponent, DndDirective ],
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  public isHovering = false;

  public files: File[] = [];

  toggleHover(event: any) {
    this.isHovering = event;
  }

  onDrop(files: any) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
