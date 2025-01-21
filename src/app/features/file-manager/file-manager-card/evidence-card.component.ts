import { Component, OnInit, inject, output, input } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'

import { MaterialModule } from 'app/services/material.module'
import { IArtifacts } from 'app/models/journals'

const imports = [MaterialModule]
  
@Component({
    selector: 'evidence-card',
    imports: [imports],
    templateUrl: './evidence-card.component.html'
})
export class EvidenceCardComponent implements OnInit {

  readonly evidence = input<IArtifacts>(undefined);
  
  update = output<number>();
  
  loggedIn: boolean = false;
  productId: string;
  sub: Subscription;
  isLoggedIn$: Observable<boolean>;

  private router = inject(Router);  
    
  ngOnInit(): void {
    console.log('Evidence id: ',this.evidence().id);
  }

  openEvidenceDetail() {
    // this.router.navigate(['artifacts/evidence', this.evidence.id]);
    this.update.emit(this.evidence().id);
  }
}
