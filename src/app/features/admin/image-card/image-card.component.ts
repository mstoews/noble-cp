import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageItemIndex } from 'app/5.models/imageItem';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css'],
})
export class ImageCardComponent implements OnInit {
  @Input() url: string | null;
  @Input() file_name: string | null;
  @Input() imageItem: ImageItemIndex | null;
  @Output() private notifyOpenImageCard: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClickCard(data: any) {
    // console.debug ('OnClickCard from ImageCardComponent');
    this.notifyOpenImageCard.emit(data);
  }
}
