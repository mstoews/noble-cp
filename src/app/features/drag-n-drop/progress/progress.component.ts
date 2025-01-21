import { Component, OnInit, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  readonly progress = input(0);
  constructor() {}

  ngOnInit() {}
}
