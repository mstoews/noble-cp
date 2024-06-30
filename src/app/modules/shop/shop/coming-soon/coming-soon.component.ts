import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router'

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {

  constructor(private route: Router, private _location: Location ) {

  }

  backToShop() {
    this._location.back()
  }
}
