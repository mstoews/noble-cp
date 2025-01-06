import { Component, OnInit, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  constructor() {}

  ngOnInit() {}
}
