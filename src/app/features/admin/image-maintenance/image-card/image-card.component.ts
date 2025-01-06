import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'maintenance-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css'],
})
export class ImageCardComponent implements OnInit {
  @Input() url: string | null;
  @Input() file_name: string | null;
  @Input() caption: string | null;
  @Input() alt: string | null;

  constructor() {}

  ngOnInit(): void {
    console.debug('url: ' + this.url);
  }
}
