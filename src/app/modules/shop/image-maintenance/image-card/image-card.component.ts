import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'maintenance-image-card',
  template: `
  <div class="flex">
    <img [src]="url" alt="alt" class="object-cover object-center w-full h-full lg:h-full lg:w-full" width="400" height="400">
    <p class="text-center">{{file_name}}</p>
    <p class="text-center">{{caption}}</p>
  </div>
  `,
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
